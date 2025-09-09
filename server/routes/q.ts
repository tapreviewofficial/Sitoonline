import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/:code", async (req, res) => {
  const t = await prisma.ticket.findUnique({ where: { code: req.params.code } });
  if (!t) return res.status(404).send("Codice non trovato");
  if (t.usedAt) return res.status(410).send("Codice già usato");
  if (t.expiresAt && new Date() > t.expiresAt) return res.status(410).send("Codice scaduto");
  res.json({ ok: true, code: t.code, status: t.usedAt ? "USED" : "ACTIVE" });
});

export default router;