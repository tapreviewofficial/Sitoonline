import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { storage } from "../storage.js";
import { requireAuth } from "../lib/auth.js";
import { customAlphabet } from "nanoid";

const router = Router();
const prisma = new PrismaClient();
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

// recupera userId dal middleware auth
function getUserId(req: any) { 
  return (req as any).user?.userId || 1; 
}

// Ottieni tutte le promozioni dell'utente
router.get("/promos", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    
    const promos = await prisma.promo.findMany({
      where: { userId },
      include: {
        publicPage: true,
        _count: {
          select: { tickets: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(promos);
  } catch (error) {
    console.error("Errore recupero promozioni:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Ottieni dettaglio promozione
router.get("/promos/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const promoId = parseInt(req.params.id);

    const promo = await prisma.promo.findFirst({
      where: { id: promoId, userId },
      include: {
        publicPage: true,
        tickets: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!promo) {
      return res.status(404).json({ error: "Promozione non trovata" });
    }

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
    const { title, description, type, startAt, endAt, publicPageId } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Titolo e tipo sono obbligatori" });
    }

    const promo = await prisma.promo.create({
      data: {
        userId,
        title,
        description,
        type,
        startAt: startAt ? new Date(startAt) : new Date(),
        endAt: endAt ? new Date(endAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        publicPageId: publicPageId || null
      },
      include: {
        publicPage: true
      }
    });

    res.status(201).json(promo);
  } catch (error) {
    console.error("Errore creazione promozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Aggiorna promozione
router.patch("/promos/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const promoId = parseInt(req.params.id);
    const { title, description, type, startAt, endAt, active, publicPageId } = req.body;

    const existingPromo = await prisma.promo.findFirst({
      where: { id: promoId, userId }
    });

    if (!existingPromo) {
      return res.status(404).json({ error: "Promozione non trovata" });
    }

    const promo = await prisma.promo.update({
      where: { id: promoId },
      data: {
        title,
        description,
        type,
        startAt: startAt ? new Date(startAt) : new Date(),
        endAt: endAt ? new Date(endAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        active,
        publicPageId: publicPageId || null
      },
      include: {
        publicPage: true
      }
    });

    res.json(promo);
  } catch (error) {
    console.error("Errore aggiornamento promozione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Elimina promozione
router.delete("/promos/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const promoId = parseInt(req.params.id);

    const existingPromo = await prisma.promo.findFirst({
      where: { id: promoId, userId }
    });

    if (!existingPromo) {
      return res.status(404).json({ error: "Promozione non trovata" });
    }

    await prisma.promo.delete({
      where: { id: promoId }
    });

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
  const items = await prisma.promo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, active: true, startAt: true, endAt: true }
  });
  res.json({ items });
});

// PATCH /:id/active -> set attiva (max 1 attiva)
router.patch("/:id/active", requireAuth, async (req, res) => {
  const userId = (req as any).user.userId;
  const id = Number(req.params.id);
  const { active } = req.body as { active: boolean };
  const promo = await prisma.promo.findFirst({ where: { id, userId } });
  if (!promo) return res.status(404).json({ error: "Promo non trovata" });
  if (active) {
    await prisma.promo.updateMany({ where: { userId }, data: { active: false } });
    await prisma.promo.update({ where: { id }, data: { active: true } });
  } else {
    await prisma.promo.update({ where: { id }, data: { active: false } });
  }
  res.json({ ok: true });
});

// GET /public/:username/active-promo -> dati minima promo attiva
router.get("/public/:username/active-promo", async (req, res) => {
  const { username } = req.params;
  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) return res.json({ active: false });
  const promo = await prisma.promo.findFirst({ where: { userId: user.id, active: true } });
  if (!promo) return res.json({ active: false });
  res.json({ active: true, title: promo.title, description: promo.description, endAt: promo.endAt });
});

// POST /public/:username/claim -> genera ticket + (stub) invio email con link/QR
router.post("/public/:username/claim", async (req, res) => {
  try {
    const { username } = req.params;
    const { name, surname, email } = req.body as { name?: string; surname?: string; email: string };
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) return res.status(404).json({ error: "Profilo non trovato" });
    const promo = await prisma.promo.findFirst({ where: { userId: user.id, active: true } });
    if (!promo) return res.status(400).json({ error: "Nessuna promozione attiva" });
    const code = nanoid();
    const origin = process.env.PUBLIC_ORIGIN || "http://localhost:5000";
    const qrUrl = `${origin}/q/${code}`;
    await prisma.ticket.create({
      data: {
        promoId: promo.id,
        customerName: name || null,
        customerSurname: surname || null,
        customerEmail: email,
        code, qrUrl,
        expiresAt: promo.endAt
      }
    });
    console.log(`[EMAIL STUB] To:${email} | Subject:Il tuo QR | Body:${qrUrl}`);
    res.json({ ok: true, code, qrUrl });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Errore" });
  }
});

export default router;