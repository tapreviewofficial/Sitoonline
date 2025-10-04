import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser } from '../lib/shared/auth.js';
import { getDatabase } from '../lib/shared/db.js';
import { promos, publicPages, tickets } from '../shared/schema.js';
import { eq, desc, count, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getCurrentUser(req.headers.cookie);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const db = getDatabase();
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api/promos', '');

  // /api/promos - GET & POST (lista e creazione)
  if (pathname === '' || pathname === '/') {
    if (req.method === 'GET') {
      try {
        const promosResult = await db
          .select({
            id: promos.id,
            userId: promos.userId,
            publicPageId: promos.publicPageId,
            title: promos.title,
            description: promos.description,
            type: promos.type,
            valueKind: promos.valueKind,
            value: promos.value,
            startAt: promos.startAt,
            endAt: promos.endAt,
            maxCodes: promos.maxCodes,
            usesPerCode: promos.usesPerCode,
            codeFormat: promos.codeFormat,
            qrMode: promos.qrMode,
            active: promos.active,
            createdAt: promos.createdAt,
            updatedAt: promos.updatedAt,
            publicPage: {
              id: publicPages.id,
              userId: publicPages.userId,
              slug: publicPages.slug,
              title: publicPages.title,
              theme: publicPages.theme,
              createdAt: publicPages.createdAt,
              updatedAt: publicPages.updatedAt
            }
          })
          .from(promos)
          .leftJoin(publicPages, eq(promos.publicPageId, publicPages.id))
          .where(eq(promos.userId, user.userId))
          .orderBy(desc(promos.createdAt));

        const promosWithCounts = await Promise.all(
          promosResult.map(async (promo) => {
            const ticketCount = await db
              .select({ count: count() })
              .from(tickets)
              .where(eq(tickets.promoId, promo.id));
            
            return {
              ...promo,
              _count: { tickets: ticketCount[0]?.count || 0 }
            };
          })
        );

        res.json(promosWithCounts);
      } catch (error) {
        console.error('Errore recupero promozioni:', error);
        res.status(500).json({ error: 'Errore interno del server' });
      }
      return;
    }

    if (req.method === 'POST') {
      try {
        const { title, description, type, startAt, endAt, publicPageId } = req.body;

        if (!title || !type) {
          return res.status(400).json({ error: 'Titolo e tipo sono obbligatori' });
        }

        const insertedPromo = await db
          .insert(promos)
          .values({
            userId: user.userId,
            title,
            description,
            type,
            startAt: startAt ? new Date(startAt) : new Date(),
            endAt: endAt ? new Date(endAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            publicPageId: publicPageId || null
          })
          .returning();

        res.status(201).json(insertedPromo[0]);
      } catch (error) {
        console.error('Errore creazione promozione:', error);
        res.status(500).json({ error: 'Errore interno del server' });
      }
      return;
    }
  }

  // /api/promos/:id - GET, PATCH, DELETE
  const idMatch = pathname.match(/^\/(\d+)$/);
  if (idMatch) {
    const promoId = parseInt(idMatch[1]);

    if (req.method === 'GET') {
      try {
        const promoResult = await db
          .select({
            id: promos.id,
            userId: promos.userId,
            publicPageId: promos.publicPageId,
            title: promos.title,
            description: promos.description,
            type: promos.type,
            valueKind: promos.valueKind,
            value: promos.value,
            startAt: promos.startAt,
            endAt: promos.endAt,
            maxCodes: promos.maxCodes,
            usesPerCode: promos.usesPerCode,
            codeFormat: promos.codeFormat,
            qrMode: promos.qrMode,
            active: promos.active,
            createdAt: promos.createdAt,
            updatedAt: promos.updatedAt,
            publicPage: {
              id: publicPages.id,
              userId: publicPages.userId,
              slug: publicPages.slug,
              title: publicPages.title,
              theme: publicPages.theme,
              createdAt: publicPages.createdAt,
              updatedAt: publicPages.updatedAt
            }
          })
          .from(promos)
          .leftJoin(publicPages, eq(promos.publicPageId, publicPages.id))
          .where(and(eq(promos.id, promoId), eq(promos.userId, user.userId)))
          .limit(1);

        if (!promoResult.length) {
          return res.status(404).json({ error: 'Promozione non trovata' });
        }

        const promo = promoResult[0];
        const promoTickets = await db
          .select()
          .from(tickets)
          .where(eq(tickets.promoId, promoId))
          .orderBy(desc(tickets.createdAt));

        res.json({
          ...promo,
          tickets: promoTickets
        });
      } catch (error) {
        console.error('Errore recupero promozione:', error);
        res.status(500).json({ error: 'Errore interno del server' });
      }
      return;
    }

    if (req.method === 'PATCH') {
      try {
        const { title, description, type, startAt, endAt, active, publicPageId } = req.body;

        const existingPromo = await db
          .select()
          .from(promos)
          .where(and(eq(promos.id, promoId), eq(promos.userId, user.userId)))
          .limit(1);

        if (!existingPromo.length) {
          return res.status(404).json({ error: 'Promozione non trovata' });
        }

        await db
          .update(promos)
          .set({
            title,
            description,
            type,
            startAt: startAt ? new Date(startAt) : new Date(),
            endAt: endAt ? new Date(endAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            active,
            publicPageId: publicPageId || null,
            updatedAt: new Date()
          })
          .where(eq(promos.id, promoId));

        res.json({ success: true });
      } catch (error) {
        console.error('Errore aggiornamento promozione:', error);
        res.status(500).json({ error: 'Errore interno del server' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      try {
        const existingPromo = await db
          .select()
          .from(promos)
          .where(and(eq(promos.id, promoId), eq(promos.userId, user.userId)))
          .limit(1);

        if (!existingPromo.length) {
          return res.status(404).json({ error: 'Promozione non trovata' });
        }

        await db.delete(promos).where(eq(promos.id, promoId));
        res.json({ success: true });
      } catch (error) {
        console.error('Errore eliminazione promozione:', error);
        res.status(500).json({ error: 'Errore interno del server' });
      }
      return;
    }
  }

  // /api/promos/:id/active - PATCH
  const activeMatch = pathname.match(/^\/(\d+)\/active$/);
  if (activeMatch && req.method === 'PATCH') {
    const id = parseInt(activeMatch[1]);
    const { active } = req.body as { active: boolean };
    
    const promo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.id, id), eq(promos.userId, user.userId)))
      .limit(1);
      
    if (!promo.length) {
      return res.status(404).json({ error: 'Promo non trovata' });
    }
    
    if (active) {
      await db
        .update(promos)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(promos.userId, user.userId));
      
      await db
        .update(promos)
        .set({ active: true, updatedAt: new Date() })
        .where(eq(promos.id, id));
    } else {
      await db
        .update(promos)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(promos.id, id));
    }
    
    res.json({ ok: true });
    return;
  }

  // /api/promos/:id/tickets/generate - POST
  const generateMatch = pathname.match(/^\/(\d+)\/tickets\/generate$/);
  if (generateMatch && req.method === 'POST') {
    const promoId = parseInt(generateMatch[1]);
    const { customerEmail, customerName, customerSurname } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Email richiesta' });
    }

    const promo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.id, promoId), eq(promos.userId, user.userId)))
      .limit(1);

    if (!promo.length) {
      return res.status(404).json({ error: 'Promozione non trovata' });
    }

    const code = nanoid(10);
    const publicOrigin = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.FRONTEND_URL || 'http://localhost:5000';
    const qrUrl = `${publicOrigin}/q/${code}`;

    const result = await db
      .insert(tickets)
      .values({
        promoId,
        customerEmail,
        customerName: customerName || null,
        customerSurname: customerSurname || null,
        code,
        qrUrl,
        expiresAt: promo[0].endAt
      })
      .returning();

    res.json(result[0]);
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
