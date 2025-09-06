import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { storage } from "../storage.js";
import { requireAuth } from "../lib/auth.js";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

const router = Router();
const prisma = new PrismaClient();

// Crea codici più leggibili con alphabet senza caratteri confusi
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

// Genera nuovo ticket per una promozione
router.post("/promos/:promoId/tickets/generate", async (req, res) => {
  try {
    const promoId = parseInt(req.params.promoId);
    const { customerName, customerEmail } = req.body;

    // Verifica che la promozione esista e sia attiva
    const promo = await prisma.promo.findFirst({
      where: { 
        id: promoId,
        active: true
      }
    });

    if (!promo) {
      return res.status(404).json({ error: "Promozione non trovata o non attiva" });
    }

    // Verifica se la promozione è ancora valida
    const now = new Date();
    if (promo.startAt && now < promo.startAt) {
      return res.status(400).json({ error: "La promozione non è ancora iniziata" });
    }
    if (promo.endAt && now > promo.endAt) {
      return res.status(400).json({ error: "La promozione è scaduta" });
    }

    // Genera codice unico
    let code = nanoid();
    let isUnique = false;
    let attempts = 0;
    
    // Assicurati che il codice sia unico (max 5 tentativi)
    while (!isUnique && attempts < 5) {
      const existing = await prisma.ticket.findUnique({ where: { code } });
      if (!existing) {
        isUnique = true;
      } else {
        code = nanoid();
        attempts++;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ error: "Impossibile generare codice unico" });
    }

    // Costruisci URL QR
    const publicOrigin = process.env.PUBLIC_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5000";
    const qrUrl = `${publicOrigin}/q/${code}`;

    // Crea ticket
    const ticket = await prisma.ticket.create({
      data: {
        promoId,
        customerName: customerName || null,
        customerEmail: customerEmail || null,
        code,
        qrPayload: qrUrl,
        expiresAt: promo.endAt
      }
    });

    // Genera QR code come data URL
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });

    res.status(201).json({
      ticketId: ticket.id,
      code,
      qrUrl,
      qrDataUrl,
      expiresAt: ticket.expiresAt
    });

  } catch (error) {
    console.error("Errore generazione ticket:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Ottieni stato ticket
router.get("/tickets/:code/status", async (req, res) => {
  try {
    const { code } = req.params;
    
    const ticket = await prisma.ticket.findUnique({
      where: { code },
      include: {
        promo: {
          select: {
            title: true,
            description: true,
            type: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ status: "not_found" });
    }

    const now = new Date();
    
    // Controlla se scaduto
    if (ticket.expiresAt && now > ticket.expiresAt) {
      return res.json({ 
        status: "expired", 
        usedAt: ticket.usedAt,
        promo: ticket.promo 
      });
    }
    
    // Controlla se già usato
    if (ticket.status === "USED") {
      return res.json({ 
        status: "used", 
        usedAt: ticket.usedAt,
        promo: ticket.promo 
      });
    }

    // Ticket valido
    return res.json({ 
      status: "valid", 
      expiresAt: ticket.expiresAt,
      promo: ticket.promo 
    });

  } catch (error) {
    console.error("Errore controllo stato ticket:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Marca ticket come usato
router.post("/tickets/:code/use", async (req, res) => {
  try {
    const { code } = req.params;
    // L'utente che scansiona (se loggato)
    const scannedByUserId = req.user?.id || null;
    
    const ticket = await prisma.ticket.findUnique({
      where: { code },
      include: {
        promo: {
          select: {
            title: true,
            description: true
          }
        }
      }
    });

    if (!ticket) {
      await prisma.scanLog.create({
        data: { 
          ticketId: 0, // ticket non trovato
          userId: scannedByUserId,
          result: "not_found",
          meta: req.get("User-Agent") || null
        }
      }).catch(() => {}); // Ignora errori di log
      
      return res.status(404).json({ status: "not_found" });
    }

    const now = new Date();

    // Controlla se scaduto
    if (ticket.expiresAt && now > ticket.expiresAt) {
      await prisma.scanLog.create({
        data: { 
          ticketId: ticket.id, 
          userId: scannedByUserId,
          result: "expired",
          meta: req.get("User-Agent") || null
        }
      });
      return res.json({ status: "expired" });
    }

    // Controlla se già usato (idempotente)
    if (ticket.status === "USED") {
      await prisma.scanLog.create({
        data: { 
          ticketId: ticket.id, 
          userId: scannedByUserId,
          result: "used",
          meta: req.get("User-Agent") || null
        }
      });
      return res.json({ status: "used", usedAt: ticket.usedAt });
    }

    // Marca come usato
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        status: "USED", 
        usedAt: now 
      }
    });

    // Log dello scan valido
    await prisma.scanLog.create({
      data: { 
        ticketId: updatedTicket.id, 
        userId: scannedByUserId,
        result: "valid",
        meta: req.get("User-Agent") || null
      }
    });

    res.json({ 
      status: "used", 
      usedAt: updatedTicket.usedAt,
      promo: ticket.promo
    });

  } catch (error) {
    console.error("Errore utilizzo ticket:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

export default router;