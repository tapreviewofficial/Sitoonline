import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../lib/shared/storage.js';
import { getDatabase } from '../lib/shared/db.js';
import { users, promos, tickets, publicPages } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { sendPromotionQRCode } from '../lib/shared/emailService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  let pathname = url.pathname.replace('/api/public', '');
  if (pathname.startsWith('/api/')) pathname = pathname.replace('/api', '');

  // Generate unique TT code
  function generateUniqueTTCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `TT-${part1}-${part2}`;
  }

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
      
      // Generate and save unique verification code
      let reviewCode: { code: string } | null = null;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!reviewCode && attempts < maxAttempts) {
        try {
          const code = generateUniqueTTCode();
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
          reviewCode = await storage.createReviewCode({
            code,
            userId: user.id,
            platform: 'public_page',
            expiresAt,
          });
        } catch (err: any) {
          if (err.code === '23505' || err.message?.includes('duplicate')) {
            attempts++;
            continue;
          }
          throw err;
        }
      }
      
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
        reviewCode: reviewCode?.code || null,
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
      const publicOrigin = process.env.FRONTEND_URL || 'https://www.taptrust.it';
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
        
      // NOTA: Database contatti promozionali disabilitato su richiesta cliente
      // I dati vengono utilizzati SOLO per l'invio della promozione corrente
      // e NON vengono archiviati permanentemente
      
      // Invia email con QR code in background (non blocca la risposta)
      sendPromotionQRCode(
        email,
        name ? `${name} ${surname || ''}`.trim() : email.split('@')[0],
        qrUrl,
        {
          title: promo[0].title,
          description: promo[0].description ?? 'Partecipa alla nostra promozione speciale!',
          validUntil: promo[0].endAt ?? undefined
        }
      ).then(emailSent => {
        if (emailSent) {
          console.log(`✅ QR Code email sent successfully to ${email}`);
        } else {
          console.log(`⚠️ Failed to send QR Code email to ${email}`);
        }
      }).catch(emailError => {
        console.error('Error sending QR Code email:', emailError);
      });
      
      // Risposta immediata al cliente (l'email arriverà tra pochi secondi)
      res.json({ ok: true, code, qrUrl });
    } catch (e: any) {
      res.status(400).json({ error: e?.message || 'Errore' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
