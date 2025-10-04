import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser, hashPassword, signToken, createAuthCookie } from '../lib/shared/auth';
import { getDatabase } from '../lib/shared/db';
import { users, profiles, links, clicks } from '@shared/schema';
import { or, ilike, desc, count, eq, gte } from 'drizzle-orm';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getCurrentUser(req.headers.cookie);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api/admin', '');

  // /api/admin/users - GET & POST
  if (pathname === '/users' && req.method === 'GET') {
    try {
      const db = getDatabase();
      const q = String(req.query.query || '').trim();
      const page = Number(req.query.page || 1);
      const pageSize = Number(req.query.pageSize || 20);
      const skip = (page - 1) * pageSize;

      const whereCondition = q ? 
        or(
          ilike(users.email, `%${q}%`),
          ilike(users.username, `%${q}%`)
        ) : undefined;

      const [totalResult, usersResult] = await Promise.all([
        db.select({ count: count() })
          .from(users)
          .where(whereCondition),
        db.select({
          id: users.id,
          email: users.email,
          username: users.username,
          role: users.role,
          createdAt: users.createdAt,
          linksCount: count(links.id),
          displayName: profiles.displayName
        })
        .from(users)
        .leftJoin(links, eq(users.id, links.userId))
        .leftJoin(profiles, eq(users.id, profiles.userId))
        .where(whereCondition)
        .groupBy(users.id, profiles.displayName)
        .orderBy(desc(users.createdAt))
        .offset(skip)
        .limit(pageSize)
      ]);

      const total = totalResult[0].count;
      const usersData = usersResult.map(user => ({
        ...user,
        _count: { links: user.linksCount },
        profile: { displayName: user.displayName }
      }));

      res.json({ total, page, pageSize, users: usersData });
    } catch (error) {
      console.error('Admin users query error:', error);
      res.status(500).json({ message: 'Errore nel caricamento utenti' });
    }
    return;
  }

  if (pathname === '/users' && req.method === 'POST') {
    try {
      const db = getDatabase();
      const adminCreateUserSchema = insertUserSchema.omit({
        password: true
      }).extend({
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
      
      const newUser = await db.insert(users)
        .values({
          email,
          username,
          password_hash: hashedPassword,
          role,
          mustChangePassword: true
        })
        .returning();

      const createdUser = newUser[0];

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
    }
    return;
  }

  // /api/admin/stats/summary
  if (pathname === '/stats/summary' && req.method === 'GET') {
    try {
      const db = getDatabase();
      const [usersCountResult, linksCountResult] = await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(links),
      ]);

      const usersCount = usersCountResult[0].count;
      const linksCount = linksCountResult[0].count;

      let clicksAllTime = 0;
      try {
        const linksResult = await db.select({ clicks: links.clicks }).from(links);
        if (linksResult.length) {
          clicksAllTime = linksResult.reduce((a: number, b: any) => a + (b.clicks || 0), 0);
        }
      } catch {
        try {
          const clicksResult = await db.select({ count: count() }).from(clicks);
          clicksAllTime = clicksResult[0].count;
        } catch {
          clicksAllTime = 0;
        }
      }

      let clicks7d = 0, clicks30d = 0;
      try {
        const now = new Date();
        const d7 = new Date(now); d7.setDate(now.getDate() - 7);
        const d30 = new Date(now); d30.setDate(now.getDate() - 30);
        
        const [clicks7dResult, clicks30dResult] = await Promise.all([
          db.select({ count: count() }).from(clicks).where(gte(clicks.createdAt, d7)),
          db.select({ count: count() }).from(clicks).where(gte(clicks.createdAt, d30))
        ]);
        
        clicks7d = clicks7dResult[0].count;
        clicks30d = clicks30dResult[0].count;
      } catch {
        clicks7d = 0; clicks30d = 0;
      }

      res.json({ usersCount, linksCount, clicksAllTime, clicks7d, clicks30d });
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  // /api/admin/impersonate/:id
  if (pathname.startsWith('/impersonate/') && req.method === 'POST') {
    const targetId = parseInt(pathname.replace('/impersonate/', ''));
    const db = getDatabase();
    
    const userResult = await db.select().from(users).where(eq(users.id, targetId)).limit(1);
    const targetUser = userResult.length ? userResult[0] : null;
    
    if (!targetUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const userToken = signToken({ userId: targetUser.id, email: targetUser.email, username: targetUser.username, role: targetUser.role });
    const adminToken = signToken({ userId: user.userId, email: user.email, username: user.username, role: 'ADMIN' });

    res.setHeader('Set-Cookie', [
      createAuthCookie(userToken),
      `impersonator=${adminToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`
    ]);
    
    res.json({ ok: true });
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

    res.setHeader('Set-Cookie', [
      createAuthCookie(impersonatorToken),
      'impersonator=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    ]);
    
    res.json({ ok: true });
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
