import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser, hashPassword, signToken, createAuthCookie } from '../lib/shared/auth.js';
import { getDatabase } from '../lib/shared/db.js';
import { users, profiles, links, clicks } from '../shared/schema.js';
import { or, ilike, desc, count, eq, gte, sql } from 'drizzle-orm';
import { insertUserSchema } from '../shared/schema.js';
import { z } from 'zod';
import postgres from 'postgres';

// Connessione diretta per query raw con schema esplicito
function getRawSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');
  return postgres(dbUrl, { ssl: 'require', max: 1, prepare: false });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getCurrentUser(req.headers.cookie);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const db = getDatabase();

  const url = new URL(req.url!, `http://${req.headers.host}`);
  let pathname = url.pathname.replace('/api/admin', '');
  if (pathname.startsWith('/api/')) pathname = pathname.replace('/api', '');

  // /api/admin/users - GET & POST (con SQL raw per massima affidabilità)
  if (pathname === '/users' && req.method === 'GET') {
    const rawSql = getRawSql();
    try {
      const q = String(req.query.query || '').trim();
      const page = Number(req.query.page || 1);
      const pageSize = Number(req.query.pageSize || 20);
      const skip = (page - 1) * pageSize;

      console.log('Admin users query - page:', page, 'pageSize:', pageSize, 'query:', q);

      // Query SQL raw con schema esplicito
      let totalResult, usersResult;
      
      if (q) {
        const searchPattern = `%${q}%`;
        totalResult = await rawSql`
          SELECT COUNT(*) as count FROM tapreview.tr_users 
          WHERE email ILIKE ${searchPattern} OR username ILIKE ${searchPattern}
        `;
        usersResult = await rawSql`
          SELECT 
            u.id, u.email, u.username, u.role, u.created_at as "createdAt",
            p.display_name as "displayName",
            COUNT(l.id) as "linksCount"
          FROM tapreview.tr_users u
          LEFT JOIN tapreview.tr_profiles p ON u.id = p.user_id
          LEFT JOIN tapreview.tr_links l ON p.id = l.profile_id
          WHERE u.email ILIKE ${searchPattern} OR u.username ILIKE ${searchPattern}
          GROUP BY u.id, p.display_name
          ORDER BY u.created_at DESC
          OFFSET ${skip} LIMIT ${pageSize}
        `;
      } else {
        totalResult = await rawSql`SELECT COUNT(*) as count FROM tapreview.tr_users`;
        usersResult = await rawSql`
          SELECT 
            u.id, u.email, u.username, u.role, u.created_at as "createdAt",
            p.display_name as "displayName",
            COUNT(l.id) as "linksCount"
          FROM tapreview.tr_users u
          LEFT JOIN tapreview.tr_profiles p ON u.id = p.user_id
          LEFT JOIN tapreview.tr_links l ON p.id = l.profile_id
          GROUP BY u.id, p.display_name
          ORDER BY u.created_at DESC
          OFFSET ${skip} LIMIT ${pageSize}
        `;
      }

      const total = Number(totalResult[0]?.count || 0);
      console.log('Admin users query - total:', total, 'results:', usersResult.length);
      
      const usersData = usersResult.map((row: any) => ({
        id: row.id,
        email: row.email,
        username: row.username,
        role: row.role,
        createdAt: row.createdAt,
        _count: { links: Number(row.linksCount) || 0 },
        profile: { displayName: row.displayName }
      }));

      res.json({ total, page, pageSize, users: usersData });
    } catch (error: any) {
      console.error('Admin users query error:', error?.message || error);
      res.status(500).json({ message: 'Errore nel caricamento utenti', error: error?.message });
    } finally {
      await rawSql.end();
    }
    return;
  }

  if (pathname === '/users' && req.method === 'POST') {
    const rawSql = getRawSql();
    try {
      const adminCreateUserSchema = z.object({
        tempPassword: z.string().min(8, 'Password temporanea minimo 8 caratteri'),
        email: z.string().email('Email non valida').toLowerCase().trim(),
        username: z.string().min(3, 'Username minimo 3 caratteri').toLowerCase().trim(),
        role: z.enum(['USER', 'ADMIN']).default('USER')
      });

      const validation = adminCreateUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Dati non validi', 
          errors: validation.error.errors.map(e => e.message)
        });
      }

      const { email, username, role, tempPassword } = validation.data;
      const hashedPassword = await hashPassword(tempPassword);
      
      const newUserResult = await rawSql`
        INSERT INTO tapreview.tr_users (email, username, password_hash, role, must_change_password)
        VALUES (${email}, ${username}, ${hashedPassword}, ${role}, true)
        RETURNING id, email, username, role, must_change_password as "mustChangePassword", created_at as "createdAt"
      `;

      const createdUser = newUserResult[0];

      res.status(201).json({
        user: {
          id: createdUser.id,
          email: createdUser.email,
          username: createdUser.username,
          role: createdUser.role,
          mustChangePassword: createdUser.mustChangePassword,
          createdAt: createdUser.createdAt
        }
      });

    } catch (error: unknown) {
      console.error('Admin create user error:', error);
      
      const isPgError = (e: unknown): e is { code?: string; constraint?: string; message?: string } => {
        return typeof e === 'object' && e !== null;
      };
      
      if (isPgError(error) && error.code === '23505') {
        const constraint = error.constraint || '';
        const message = error.message || '';
        
        if (constraint.includes('email') || message.includes('email')) {
          return res.status(409).json({ message: 'Email già registrata' });
        }
        if (constraint.includes('username') || message.includes('username')) {
          return res.status(409).json({ message: 'Username già in uso' });
        }
      }
      
      res.status(500).json({ message: 'Errore nella creazione dell\'utente' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/admin/stats/summary
  if (pathname === '/stats/summary' && req.method === 'GET') {
    const rawSql = getRawSql();
    try {
      const now = new Date();
      const d7 = new Date(now); d7.setDate(now.getDate() - 7);
      const d30 = new Date(now); d30.setDate(now.getDate() - 30);

      const [usersResult, linksResult, clicksResult, clicks7dResult, clicks30dResult] = await Promise.all([
        rawSql`SELECT COUNT(*) as count FROM tapreview.tr_users`,
        rawSql`SELECT COUNT(*) as count FROM tapreview.tr_links`,
        rawSql`SELECT COALESCE(SUM(clicks), 0) as total FROM tapreview.tr_links`,
        rawSql`SELECT COUNT(*) as count FROM tapreview.tr_clicks WHERE created_at >= ${d7}`,
        rawSql`SELECT COUNT(*) as count FROM tapreview.tr_clicks WHERE created_at >= ${d30}`
      ]);

      res.json({ 
        usersCount: Number(usersResult[0]?.count || 0), 
        linksCount: Number(linksResult[0]?.count || 0), 
        clicksAllTime: Number(clicksResult[0]?.total || 0), 
        clicks7d: Number(clicks7dResult[0]?.count || 0), 
        clicks30d: Number(clicks30dResult[0]?.count || 0) 
      });
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/admin/impersonate/:id (with audit logging and enhanced security)
  if (pathname.startsWith('/impersonate/') && req.method === 'POST') {
    const targetId = parseInt(pathname.replace('/impersonate/', ''));
    const rawSql = getRawSql();
    
    try {
      const userResult = await rawSql`SELECT id, email, username, role FROM tapreview.tr_users WHERE id = ${targetId} LIMIT 1`;
      const targetUser = userResult.length ? userResult[0] as { id: number; email: string; username: string; role: string } : null;
    
      if (!targetUser) {
        await rawSql.end();
        return res.status(404).json({ message: 'Utente non trovato' });
      }

      // SECURITY AUDIT: Log impersonation attempt
      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown';
      const auditLog = {
        timestamp: new Date().toISOString(),
        action: 'ADMIN_IMPERSONATION',
        adminId: user.userId,
        adminEmail: user.email,
        targetUserId: targetUser.id,
        targetUserEmail: targetUser.email,
        ip: clientIp,
        userAgent: req.headers['user-agent'] || 'unknown'
      };
      
      // Log to console for audit trail (in production, send to logging service)
      console.warn('[SECURITY AUDIT]', JSON.stringify(auditLog));

      const userToken = signToken({ userId: targetUser.id, email: targetUser.email, username: targetUser.username, role: targetUser.role });
      const adminToken = signToken({ userId: user.userId, email: user.email, username: user.username, role: 'ADMIN' });

      // Use SameSite=Strict for enhanced CSRF protection
      const isProduction = process.env.NODE_ENV === 'production';
      res.setHeader('Set-Cookie', [
        createAuthCookie(userToken),
        `impersonator=${adminToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${isProduction ? '; Secure' : ''}`
      ]);
      
      res.json({ ok: true });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/admin/stop-impersonate
  if (pathname === '/stop-impersonate' && req.method === 'POST') {
    const cookies = req.headers.cookie || '';
    const impersonatorMatch = cookies.match(/impersonator=([^;]+)/);
    
    if (!impersonatorMatch) {
      return res.status(400).json({ message: 'No impersonator cookie found' });
    }

    const impersonatorToken = impersonatorMatch[1];

    // SECURITY AUDIT: Log stop impersonation
    console.warn('[SECURITY AUDIT]', JSON.stringify({
      timestamp: new Date().toISOString(),
      action: 'ADMIN_STOP_IMPERSONATION',
      adminId: user.userId,
      ip: req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown'
    }));

    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      createAuthCookie(impersonatorToken),
      `impersonator=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProduction ? '; Secure' : ''}`
    ]);
    
    res.json({ ok: true });
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
