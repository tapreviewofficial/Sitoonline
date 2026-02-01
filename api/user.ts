import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser } from '../lib/shared/auth.js';
import { insertProfileSchema, insertLinkSchema } from '../shared/schema.js';
import postgres from 'postgres';

function getRawSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');
  return postgres(dbUrl, { ssl: 'require', max: 1, prepare: false });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getCurrentUser(req.headers.cookie);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const url = new URL(req.url!, `http://${req.headers.host}`);
  let pathname = url.pathname.replace('/api/user', '');
  if (pathname.startsWith('/api/')) {
    pathname = pathname.replace('/api', '');
  }

  // /api/user/me
  if (pathname === '/me' && req.method === 'GET') {
    const rawSql = getRawSql();
    try {
      const result = await rawSql`SELECT id, email, username, role, must_change_password as "mustChangePassword" FROM tapreview.tr_users WHERE id = ${user.userId} LIMIT 1`;
      if (!result.length) {
        return res.status(401).json({ message: 'User not found' });
      }
      res.json({ user: result[0] });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/user/profile - GET
  if (pathname === '/profile' && req.method === 'GET') {
    const rawSql = getRawSql();
    try {
      const result = await rawSql`
        SELECT id, user_id as "userId", display_name as "displayName", bio, avatar_url as "avatarUrl", 
               accent_color as "accentColor", business_name as "businessName", description, 
               logo_url as "logoUrl", background_url as "backgroundUrl", theme_color as "themeColor",
               custom_message as "customMessage", is_active as "isActive"
        FROM tapreview.tr_profiles WHERE user_id = ${user.userId} LIMIT 1
      `;
      res.json(result[0] || {});
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/user/profile - PUT
  if (pathname === '/profile' && req.method === 'PUT') {
    const rawSql = getRawSql();
    try {
      const { displayName, bio, avatarUrl, accentColor, businessName, description, logoUrl, backgroundUrl, themeColor, customMessage, isActive } = req.body;
      
      const result = await rawSql`
        INSERT INTO tapreview.tr_profiles (user_id, display_name, bio, avatar_url, accent_color, business_name, description, logo_url, background_url, theme_color, custom_message, is_active)
        VALUES (${user.userId}, ${displayName || null}, ${bio || null}, ${avatarUrl || null}, ${accentColor || '#CC9900'}, ${businessName || null}, ${description || null}, ${logoUrl || null}, ${backgroundUrl || null}, ${themeColor || null}, ${customMessage || null}, ${isActive !== false})
        ON CONFLICT (user_id) DO UPDATE SET
          display_name = ${displayName || null},
          bio = ${bio || null},
          avatar_url = ${avatarUrl || null},
          accent_color = ${accentColor || '#CC9900'},
          business_name = ${businessName || null},
          description = ${description || null},
          logo_url = ${logoUrl || null},
          background_url = ${backgroundUrl || null},
          theme_color = ${themeColor || null},
          custom_message = ${customMessage || null},
          is_active = ${isActive !== false}
        RETURNING id, user_id as "userId", display_name as "displayName", bio, avatar_url as "avatarUrl", accent_color as "accentColor", business_name as "businessName", description, logo_url as "logoUrl", background_url as "backgroundUrl", theme_color as "themeColor", custom_message as "customMessage", is_active as "isActive"
      `;
      res.json(result[0]);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({ message: 'Failed to update profile' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/user/links - GET
  if (pathname === '/links' && req.method === 'GET') {
    const rawSql = getRawSql();
    try {
      const result = await rawSql`
        SELECT l.id, l.profile_id as "profileId", l.title, l.url, l.icon, l.order_index as "orderIndex", l."order", l.is_active as "isActive", l.clicks, l.created_at as "createdAt"
        FROM tapreview.tr_links l
        JOIN tapreview.tr_profiles p ON l.profile_id = p.id
        WHERE p.user_id = ${user.userId}
        ORDER BY l."order" ASC
      `;
      res.json(result);
    } catch (error) {
      console.error('Get links error:', error);
      res.status(500).json({ message: 'Failed to fetch links' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/user/links - POST
  if (pathname === '/links' && req.method === 'POST') {
    const rawSql = getRawSql();
    try {
      const { title, url: linkUrl, icon, orderIndex, order, isActive } = req.body;
      
      const profileResult = await rawSql`SELECT id FROM tapreview.tr_profiles WHERE user_id = ${user.userId} LIMIT 1`;
      if (!profileResult.length) {
        return res.status(400).json({ message: 'Profile not found' });
      }
      const profileId = profileResult[0].id;
      
      const result = await rawSql`
        INSERT INTO tapreview.tr_links (profile_id, title, url, icon, order_index, "order", is_active)
        VALUES (${profileId}, ${title}, ${linkUrl}, ${icon || null}, ${orderIndex || 0}, ${order || 0}, ${isActive !== false})
        RETURNING id, profile_id as "profileId", title, url, icon, order_index as "orderIndex", "order", is_active as "isActive", clicks, created_at as "createdAt"
      `;
      res.json(result[0]);
    } catch (error) {
      console.error('Create link error:', error);
      res.status(400).json({ message: 'Failed to create link' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/user/links/:id - PATCH
  if (pathname.startsWith('/links/') && req.method === 'PATCH') {
    const linkId = parseInt(pathname.replace('/links/', ''));
    const rawSql = getRawSql();
    try {
      const { title, url: linkUrl, icon, orderIndex, order, isActive } = req.body;
      
      const result = await rawSql`
        UPDATE tapreview.tr_links SET
          title = COALESCE(${title}, title),
          url = COALESCE(${linkUrl}, url),
          icon = COALESCE(${icon}, icon),
          order_index = COALESCE(${orderIndex}, order_index),
          "order" = COALESCE(${order}, "order"),
          is_active = COALESCE(${isActive}, is_active)
        WHERE id = ${linkId}
        RETURNING id, profile_id as "profileId", title, url, icon, order_index as "orderIndex", "order", is_active as "isActive", clicks, created_at as "createdAt"
      `;
      res.json(result[0]);
    } catch (error) {
      console.error('Update link error:', error);
      res.status(400).json({ message: 'Failed to update link' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/user/links/:id - DELETE
  if (pathname.startsWith('/links/') && req.method === 'DELETE') {
    const linkId = parseInt(pathname.replace('/links/', ''));
    const rawSql = getRawSql();
    try {
      await rawSql`DELETE FROM tapreview.tr_links WHERE id = ${linkId}`;
      res.json({ message: 'Link deleted' });
    } catch (error) {
      console.error('Delete link error:', error);
      res.status(400).json({ message: 'Failed to delete link' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  // /api/review-codes - GET
  if (pathname === '/review-codes' && req.method === 'GET') {
    const rawSql = getRawSql();
    try {
      const result = await rawSql`SELECT * FROM tapreview.review_codes WHERE user_id = ${user.userId}`;
      res.json(result);
    } catch (error) {
      console.error('Get review codes error:', error);
      res.status(500).json({ message: 'Failed to fetch review codes' });
    } finally {
      await rawSql.end();
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
