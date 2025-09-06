import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Ottieni pagina pubblica per slug (pubblica)
router.get("/public-pages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const publicPage = await prisma.publicPage.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            username: true
          }
        },
        promos: {
          where: {
            active: true,
            OR: [
              { startAt: null },
              { startAt: { lte: new Date() } }
            ],
            AND: [
              {
                OR: [
                  { endAt: null },
                  { endAt: { gte: new Date() } }
                ]
              }
            ]
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!publicPage) {
      return res.status(404).json({ error: "Pagina non trovata" });
    }

    res.json(publicPage);
  } catch (error) {
    console.error("Errore recupero pagina pubblica:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Ottieni pagine pubbliche dell'utente (autenticato)
router.get("/public-pages", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const publicPages = await prisma.publicPage.findMany({
      where: { userId },
      include: {
        _count: {
          select: { promos: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(publicPages);
  } catch (error) {
    console.error("Errore recupero pagine pubbliche:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Crea nuova pagina pubblica
router.post("/public-pages", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { slug, title, theme } = req.body;

    if (!slug) {
      return res.status(400).json({ error: "Slug è obbligatorio" });
    }

    // Verifica che lo slug sia unico
    const existing = await prisma.publicPage.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: "Questo slug è già in uso" });
    }

    const publicPage = await prisma.publicPage.create({
      data: {
        userId,
        slug,
        title: title || null,
        theme: theme ? JSON.stringify(theme) : null
      }
    });

    res.status(201).json(publicPage);
  } catch (error) {
    console.error("Errore creazione pagina pubblica:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Aggiorna pagina pubblica
router.patch("/public-pages/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const pageId = parseInt(req.params.id);
    const { slug, title, theme } = req.body;

    const existingPage = await prisma.publicPage.findFirst({
      where: { id: pageId, userId }
    });

    if (!existingPage) {
      return res.status(404).json({ error: "Pagina non trovata" });
    }

    // Se lo slug è cambiato, verifica che sia unico
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.publicPage.findUnique({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ error: "Questo slug è già in uso" });
      }
    }

    const publicPage = await prisma.publicPage.update({
      where: { id: pageId },
      data: {
        slug: slug || existingPage.slug,
        title: title !== undefined ? title : existingPage.title,
        theme: theme ? JSON.stringify(theme) : existingPage.theme
      }
    });

    res.json(publicPage);
  } catch (error) {
    console.error("Errore aggiornamento pagina pubblica:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Elimina pagina pubblica
router.delete("/public-pages/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const pageId = parseInt(req.params.id);

    const existingPage = await prisma.publicPage.findFirst({
      where: { id: pageId, userId }
    });

    if (!existingPage) {
      return res.status(404).json({ error: "Pagina non trovata" });
    }

    await prisma.publicPage.delete({
      where: { id: pageId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Errore eliminazione pagina pubblica:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

export default router;