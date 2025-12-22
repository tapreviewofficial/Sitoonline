import { Router } from "express";
import { db, promos, tickets, users, publicPages, profiles } from "../lib/supabase";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { storage } from "../storage.js";
import { requireAuth } from "../lib/auth.js";
import { customAlphabet } from "nanoid";
import { EmailService } from "../lib/email-service.js";
import { logPromoEmail, updatePromoEmailStatus } from "../lib/db.js";

const router = Router();
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

// recupera userId dal middleware auth
function getUserId(req: any) { 
  return (req as any).user?.userId || 1; 
}

// Helper per ottenere profileId dall'userId
async function getProfileIdFromUserId(userId: number): Promise<number | null> {
  const result = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result[0]?.id || null;
}

// Ottieni tutte le promozioni dell'utente
router.get("/promos", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const profileId = await getProfileIdFromUserId(userId);
    
    if (!profileId) {
      return res.json([]);
    }
    
    const promosResult = await db
      .select({
        id: promos.id,
        profileId: promos.profileId,
        publicPageId: promos.publicPageId,
        title: promos.title,
        description: promos.description,
        discountCode: promos.discountCode,
        validUntil: promos.validUntil,
        isActive: promos.isActive,
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
        updatedAt: promos.updatedAt
      })
      .from(promos)
      .where(eq(promos.profileId, profileId))
      .orderBy(desc(promos.createdAt));

    // Note: tickets are linked to profiles, not individual promos
    // So we return promos without ticket counts for now
    res.json(promosResult);
  } catch (error) {
    console.error("Errore recupero promozioni:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Ottieni dettaglio promozione
router.get("/promos/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const profileId = await getProfileIdFromUserId(userId);
    const promoId = parseInt(req.params.id);
    
    if (!profileId) {
      return res.status(404).json({ error: "Profilo non trovato" });
    }

    const promoResult = await db
      .select({
        id: promos.id,
        profileId: promos.profileId,
        publicPageId: promos.publicPageId,
        title: promos.title,
        description: promos.description,
        discountCode: promos.discountCode,
        validUntil: promos.validUntil,
        isActive: promos.isActive,
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
        updatedAt: promos.updatedAt
      })
      .from(promos)
      .where(and(eq(promos.id, promoId), eq(promos.profileId, profileId)))
      .limit(1);

    if (!promoResult.length) {
      return res.status(404).json({ error: "Promozione non trovata" });
    }

    const promo = promoResult[0];
    
    // Note: tickets are linked to profiles, not individual promos
    res.json(promo);
  } catch (error) {
    console.error("Errore recupero promozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Crea nuova promozione
router.post("/promos", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const profileId = await getProfileIdFromUserId(userId);
    
    if (!profileId) {
      return res.status(400).json({ error: "Profilo non trovato" });
    }
    
    const { title, description, discountCode, startAt, endAt, publicPageId, valueKind, value, maxCodes, usesPerCode, codeFormat, qrMode } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Titolo è obbligatorio" });
    }

    const insertedPromo = await db
      .insert(promos)
      .values({
        profileId,
        title,
        description: description || null,
        discountCode: discountCode || null,
        valueKind: valueKind || null,
        value: value || null,
        startAt: startAt ? new Date(startAt) : new Date(),
        endAt: endAt ? new Date(endAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxCodes: maxCodes || 100,
        usesPerCode: usesPerCode || 1,
        codeFormat: codeFormat || 'short',
        qrMode: qrMode || 'url',
        publicPageId: publicPageId || null
      })
      .returning();

    res.status(201).json(insertedPromo[0]);
  } catch (error) {
    console.error("Errore creazione promozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Aggiorna promozione
router.patch("/promos/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const profileId = await getProfileIdFromUserId(userId);
    const promoId = parseInt(req.params.id);
    
    if (!profileId) {
      return res.status(404).json({ error: "Profilo non trovato" });
    }
    
    const { title, description, discountCode, startAt, endAt, active, publicPageId, valueKind, value, maxCodes, usesPerCode } = req.body;

    const existingPromo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.id, promoId), eq(promos.profileId, profileId)))
      .limit(1);

    if (!existingPromo.length) {
      return res.status(404).json({ error: "Promozione non trovata" });
    }

    const updatedPromo = await db
      .update(promos)
      .set({
        title,
        description,
        discountCode,
        valueKind,
        value,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
        maxCodes,
        usesPerCode,
        active,
        publicPageId: publicPageId || null,
        updatedAt: new Date()
      })
      .where(eq(promos.id, promoId))
      .returning();

    res.json(updatedPromo[0]);
  } catch (error) {
    console.error("Errore aggiornamento promozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Elimina promozione
router.delete("/promos/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const profileId = await getProfileIdFromUserId(userId);
    const promoId = parseInt(req.params.id);
    
    if (!profileId) {
      return res.status(404).json({ error: "Profilo non trovato" });
    }

    const existingPromo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.id, promoId), eq(promos.profileId, profileId)))
      .limit(1);

    if (!existingPromo.length) {
      return res.status(404).json({ error: "Promozione non trovata" });
    }

    await db
      .delete(promos)
      .where(eq(promos.id, promoId));

    res.json({ success: true });
  } catch (error) {
    console.error("Errore eliminazione promozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// NUOVI ENDPOINT AGGIUNTI PER LA FUNZIONALITÀ RICHIESTA

// GET / -> lista promozioni dell'utente (per UI lista semplificata)
router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).user.userId;
  const profileId = await getProfileIdFromUserId(userId);
  
  if (!profileId) {
    return res.json({ items: [] });
  }
  
  const items = await db
    .select({
      id: promos.id,
      title: promos.title,
      description: promos.description,
      active: promos.active,
      startAt: promos.startAt,
      endAt: promos.endAt
    })
    .from(promos)
    .where(eq(promos.profileId, profileId))
    .orderBy(desc(promos.createdAt));
  res.json({ items });
});

// PATCH /promos/:id/active -> set attiva (max 1 attiva)
router.patch("/promos/:id/active", requireAuth, async (req, res) => {
  const userId = (req as any).user.userId;
  const profileId = await getProfileIdFromUserId(userId);
  const id = Number(req.params.id);
  const { active } = req.body as { active: boolean };
  
  if (!profileId) {
    return res.status(404).json({ error: "Profilo non trovato" });
  }
  
  const promo = await db
    .select()
    .from(promos)
    .where(and(eq(promos.id, id), eq(promos.profileId, profileId)))
    .limit(1);
    
  if (!promo.length) return res.status(404).json({ error: "Promo non trovata" });
  
  if (active) {
    // Deactivate all user's promos first
    await db
      .update(promos)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(promos.profileId, profileId));
    
    // Then activate the specific promo
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
});

// GET /public/:username/active-promo -> dati minima promo attiva
router.get("/public/:username/active-promo", async (req, res) => {
  const { username } = req.params;
  
  // Join user -> profile -> promo
  const profile = await db
    .select({ id: profiles.id })
    .from(profiles)
    .leftJoin(users, eq(profiles.userId, users.id))
    .where(eq(users.username, username))
    .limit(1);
    
  if (!profile.length) return res.json({ active: false });
  
  const promo = await db
    .select()
    .from(promos)
    .where(and(eq(promos.profileId, profile[0].id), eq(promos.active, true)))
    .limit(1);
    
  if (!promo.length) return res.json({ active: false });
  
  res.json({ 
    active: true, 
    title: promo[0].title, 
    description: promo[0].description, 
    endAt: promo[0].endAt 
  });
});

// POST /public/:username/claim -> genera ticket + (stub) invio email con link/QR
router.post("/public/:username/claim", async (req, res) => {
  try {
    const { username } = req.params;
    const { name, surname, email } = req.body as { name?: string; surname?: string; email: string };
    
    // Join user -> profile
    const profile = await db
      .select({ id: profiles.id })
      .from(profiles)
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(eq(users.username, username))
      .limit(1);
      
    if (!profile.length) return res.status(404).json({ error: "Profilo non trovato" });
    
    const profileId = profile[0].id;
    
    const promo = await db
      .select()
      .from(promos)
      .where(and(eq(promos.profileId, profileId), eq(promos.active, true)))
      .limit(1);
      
    if (!promo.length) return res.status(400).json({ error: "Nessuna promozione attiva" });
    
    const code = nanoid();
    const publicOrigin = process.env.FRONTEND_URL || 'https://www.taptrust.it';
    const qrUrl = `${publicOrigin}/q/${code}`;
    
    // Insert ticket linked to profile
    await db
      .insert(tickets)
      .values({
        profileId,
        code, 
        title: promo[0].title,
        description: promo[0].description,
        customerSurname: surname || null,
        expiresAt: promo[0].endAt
      });
      
    // NOTA: Database contatti promozionali disabilitato su richiesta cliente
    // I dati vengono utilizzati SOLO per l'invio della promozione corrente
    // e NON vengono archiviati permanentemente nella tabella promotionalContacts
      
    // Invia email con QR code tramite OVH SMTP e logga l'operazione
    let emailLogId: string | null = null;
    try {
      // Logga prima dell'invio
      emailLogId = await logPromoEmail({
        name: name ? `${name} ${surname || ''}`.trim() : undefined,
        email,
        code,
        promoTitle: promo[0].title,
        status: 'queued'
      });

      const emailSent = await EmailService.sendPromotionQRCode(
        email,
        name ? `${name} ${surname || ''}`.trim() : email.split('@')[0],
        qrUrl,
        {
          title: promo[0].title,
          description: promo[0].description ?? 'Partecipa alla nostra promozione speciale!',
          validUntil: promo[0].endAt ?? undefined
        }
      );
      
      if (emailSent) {
        console.log(`✅ QR Code email sent successfully to ${email}`);
        if (emailLogId) await updatePromoEmailStatus(emailLogId, 'sent');
      } else {
        console.log(`⚠️ Failed to send QR Code email to ${email}`);
        if (emailLogId) await updatePromoEmailStatus(emailLogId, 'failed', 'Email service returned false');
      }
    } catch (emailError) {
      console.error('Error sending QR Code email:', emailError);
      if (emailLogId) {
        await updatePromoEmailStatus(emailLogId, 'failed', emailError instanceof Error ? emailError.message : 'Unknown email error');
      }
      // Non bloccare la risposta anche se l'email fallisce
    }
    
    res.json({ ok: true, code, qrUrl });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Errore" });
  }
});

export default router;