import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getCurrentUser } from '../lib/shared/auth.js';
import { storage } from '../lib/shared/storage.js';
import { getDatabase } from '../lib/shared/db.js';
import { publicPages, users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // /api/promotional-contacts - GET
  if (pathname === '/api/promotional-contacts' && req.method === 'GET') {
    const user = await getCurrentUser(req.headers.cookie);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const contacts = await storage.getPromotionalContacts(user.userId);
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching promotional contacts:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
    return;
  }

  // /api/public-pages/:slug - GET
  const publicPageMatch = pathname.match(/^\/api\/public-pages\/([^/]+)$/);
  if (publicPageMatch && req.method === 'GET') {
    const slug = publicPageMatch[1];
    const db = getDatabase();

    const page = await db
      .select({
        id: publicPages.id,
        userId: publicPages.userId,
        slug: publicPages.slug,
        title: publicPages.title,
        theme: publicPages.theme,
        createdAt: publicPages.createdAt,
        updatedAt: publicPages.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          email: users.email
        }
      })
      .from(publicPages)
      .leftJoin(users, eq(publicPages.userId, users.id))
      .where(eq(publicPages.slug, slug))
      .limit(1);

    if (!page.length) {
      return res.status(404).json({ error: 'Pagina non trovata' });
    }

    res.json(page[0]);
    return;
  }

  // /api/r/:username/:linkId - GET (redirect tracciato)
  const redirectMatch = pathname.match(/^\/api\/r\/([^/]+)\/(\d+)$/);
  if (redirectMatch && req.method === 'GET') {
    try {
      const username = redirectMatch[1];
      const linkIdNum = parseInt(redirectMatch[2]);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const links = await storage.getLinks(user.id);
      const link = links.find(l => l.id === linkIdNum);
      if (!link) {
        return res.status(404).json({ message: 'Link not found' });
      }

      const userAgent = req.headers['user-agent'] || null;
      const referer = req.headers.referer || null;
      const forwarded = req.headers['x-forwarded-for'];
      const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : null;
      const ipHash = ip ? crypto.createHash('sha256').update(ip + (process.env.JWT_SECRET || '')).digest('hex') : null;

      await storage.createClick({
        linkId: linkIdNum,
        userAgent,
        referer,
        ipHash,
      });

      await storage.incrementLinkClicks(linkIdNum);

      res.redirect(302, link.url);
    } catch (error) {
      console.error('Redirect error:', error);
      res.status(500).json({ message: 'Redirect failed' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
