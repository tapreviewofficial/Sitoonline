import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Ottieni tutte le promozioni dell'utente
router.get("/promos", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
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
    const userId = req.user.id;
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
    const userId = req.user.id;
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
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
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
    const userId = req.user.id;
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
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
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
    const userId = req.user.id;
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

export default router;