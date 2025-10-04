import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../lib/shared/storage.js';
import { getDatabase } from '../lib/shared/db.js';
import { users, promos, tickets, publicPages } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  let pathname = url.pathname.replace('/api/public', '');
  if (pathname.startsWith('/api/')) pathname = pathname.replace('/api', '');

  // /api/public/:username - GET (profilo pubblico)
  const usernameMatch = pathname.match(/^\/([^/]+)$/);
  if (usernameMatch && req.method === 'GET') {
    try {
      const username = usernameMatch[1];
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const profile = await storage.getProfile(user.id);
      const links = await storage.getLinksByUsername(username);
      
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      res.json({
        profile: {
          displayName: profile?.displayName || user.username,
          bio: profile?.bio || '',
          avatarUrl: profile?.avatarUrl || null,
          accentColor: profile?.accentColor || '#CC9900',
        },
        user: {
          username: user.username,
        },
        links,
      });
    } catch (error) {
      console.error('Get public profile error:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
    return;
  }

  // /api/public/:username/active-promo - GET
  const activePromoMatch = pathname.match(/^\/([^/]+)\/active-promo$/);
  if (activePromoMatch && req.method === 'GET') {
    const username = activePromoMatch[1];
    const db = getDatabase();
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
      
    if (!user.length) {
      return res.json({ active: false });
    }
    
    const promo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.userId, user[0].id), eq(promos.active, true)))
      .limit(1);
      
    if (!promo.length) {
      return res.json({ active: false });
    }
    
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    res.json({ 
      active: true, 
      title: promo[0].title, 
      description: promo[0].description, 
      endAt: promo[0].endAt 
    });
    return;
  }

  // /api/public/:username/claim - POST
  const claimMatch = pathname.match(/^\/([^/]+)\/claim$/);
  if (claimMatch && req.method === 'POST') {
    try {
      const username = claimMatch[1];
      const { name, surname, email } = req.body as { name?: string; surname?: string; email: string };
      
      const db = getDatabase();
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
        
      if (!user.length) {
        return res.status(404).json({ error: 'Profilo non trovato' });
      }
      
      const promo = await db
        .select()
        .from(promos)
        .where(and(eq(promos.userId, user[0].id), eq(promos.active, true)))
        .limit(1);
        
      if (!promo.length) {
        return res.status(400).json({ error: 'Nessuna promozione attiva' });
      }
      
      const code = nanoid(10);
      const publicOrigin = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.FRONTEND_URL || 'http://localhost:5000';
      const qrUrl = `${publicOrigin}/q/${code}`;
      
      await db
        .insert(tickets)
        .values({
          promoId: promo[0].id,
          customerName: name || null,
          customerSurname: surname || null,
          customerEmail: email,
          code, 
          qrUrl,
          expiresAt: promo[0].endAt
        });
        
      try {
        await storage.createOrUpdatePromotionalContact({
          email,
          firstName: name || null,
          lastName: surname || null,
          userId: user[0].id,
          lastPromoRequested: promo[0].title || 'Promozione',
          totalPromoRequests: 1
        });
      } catch (contactError) {
        console.error('Error saving promotional contact:', contactError);
      }
      
      res.json({ ok: true, code, qrUrl });
    } catch (e: any) {
      res.status(400).json({ error: e?.message || 'Errore' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
