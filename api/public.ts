import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../lib/shared/storage.js';
import { getDatabase, initSearchPath } from '../lib/shared/db.js';
import { users, promos, tickets, publicPages, profiles } from '../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { sendPromotionQRCode } from '../lib/shared/emailService.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const TAP_TOKEN_TTL = 60; // 60 seconds

if (!JWT_SECRET) {
  console.error('WARNING: JWT_SECRET not set');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initSearchPath();
  const url = new URL(req.url!, `http://${req.headers.host}`);
  let pathname = url.pathname;
  
  // Handle /tap/:username route
  if (pathname.startsWith('/tap/')) {
    const username = pathname.replace('/tap/', '').split('/')[0];
    if (username && req.method === 'GET') {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.redirect(302, `/${username}`);
      }
      
      // Generate JWT tap token with 60s expiry
      if (!JWT_SECRET) {
        return res.status(500).json({ error: 'Server configuration error' });
      }
      const tapToken = jwt.sign(
        { username, type: 'tap', iat: Math.floor(Date.now() / 1000) },
        JWT_SECRET,
        { expiresIn: TAP_TOKEN_TTL }
      );
      
      // Set HTTP-only cookie (SameSite=Lax for redirect compatibility)
      res.setHeader('Set-Cookie', `tt_tap_token=${tapToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${TAP_TOKEN_TTL}; Path=/`);
      
      // Redirect to profile with tapToken in URL
      const frontendUrl = process.env.FRONTEND_URL || 'https://www.taptrust.it';
      return res.redirect(302, `${frontendUrl}/${username}?tapToken=${tapToken}`);
    }
  }
  
  // Normalize pathname for other routes
  pathname = pathname.replace('/api/public', '');
  if (pathname.startsWith('/api/')) pathname = pathname.replace('/api', '');

  // Generate unique TT code
  function generateUniqueTTCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `TT-${part1}-${part2}`;
  }

  // /api/public/:username/tap-claim - POST (validate tap token and generate TT code)
  const tapClaimMatch = pathname.match(/^\/([^/]+)\/tap-claim$/);
  if (tapClaimMatch && req.method === 'POST') {
    try {
      const username = tapClaimMatch[1];
      const { tapToken } = req.body as { tapToken: string };
      
      // Get cookie
      const cookies = req.headers.cookie || '';
      const cookieToken = cookies.split(';').find(c => c.trim().startsWith('tt_tap_token='))?.split('=')[1];
      
      // Validate both token and cookie match
      if (!tapToken || !cookieToken || tapToken !== cookieToken) {
        return res.status(403).json({ 
          error: 'tap_required',
          message: 'Per ottenere il codice verifica, usa la card NFC' 
        });
      }
      
      // Verify JWT
      if (!JWT_SECRET) {
        return res.status(500).json({ error: 'Server configuration error' });
      }
      
      try {
        const decoded = jwt.verify(tapToken, JWT_SECRET) as { username: string; type: string };
        if (decoded.type !== 'tap' || decoded.username !== username) {
          return res.status(403).json({ error: 'invalid_token', message: 'Token non valido' });
        }
      } catch (jwtError) {
        return res.status(403).json({ error: 'session_expired', message: 'Sessione scaduta. Fai un nuovo tap con la card NFC' });
      }
      
      // Generate TT code
      let reviewCode: { code: string; expiresAt: Date | null } | null = null;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (!reviewCode && attempts < maxAttempts) {
        try {
          const code = generateUniqueTTCode();
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          reviewCode = await storage.createReviewCode({ code, username, expiresAt });
        } catch (err: any) {
          if (err.code === '23505' || err.message?.includes('duplicate')) {
            attempts++;
            continue;
          }
          throw err;
        }
      }
      
      if (!reviewCode) {
        return res.status(500).json({ error: 'Errore generazione codice' });
      }
      
      // Clear tap token cookie, set code session cookie
      res.setHeader('Set-Cookie', [
        'tt_tap_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/',
        `tt_code_session=${reviewCode.code}; HttpOnly; Secure; SameSite=Lax; Max-Age=${24*60*60}; Path=/`
      ]);
      
      res.json({ success: true, reviewCode: reviewCode.code, expiresAt: reviewCode.expiresAt });
    } catch (error) {
      console.error('Tap claim error:', error);
      res.status(500).json({ error: 'Errore interno' });
    }
    return;
  }

  // /api/public/:username - GET (profilo pubblico)
  const usernameMatch = pathname.match(/^\/([^/]+)$/);
  if (usernameMatch && req.method === 'GET') {
    try {
      const username = usernameMatch[1];
      const tapToken = url.searchParams.get('tapToken');
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const profile = await storage.getProfile(user.id);
      const links = await storage.getLinksByUsername(username);
      
      // Check if there's a pending tap (valid tapToken in URL)
      let hasPendingTap = false;
      if (tapToken && JWT_SECRET) {
        try {
          const decoded = jwt.verify(tapToken, JWT_SECRET) as { username: string; type: string };
          hasPendingTap = decoded.type === 'tap' && decoded.username === username;
        } catch {
          hasPendingTap = false;
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
        reviewCode: null,
        expiresAt: null,
        hasPendingTap,
        tapToken: hasPendingTap ? tapToken : null,
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
    
    // Get user's profile
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user[0].id))
      .limit(1);
      
    if (!profile.length) {
      return res.json({ active: false });
    }
    
    const promo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.profileId, profile[0].id), eq(promos.isActive, true)))
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
      
      // Get user's profile
      const profile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user[0].id))
        .limit(1);
        
      if (!profile.length) {
        return res.status(404).json({ error: 'Profilo non trovato' });
      }
      
      const promo = await db
        .select()
        .from(promos)
        .where(and(eq(promos.profileId, profile[0].id), eq(promos.isActive, true)))
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
          profileId: profile[0].id,
          customerSurname: surname || name || null,
          code, 
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
