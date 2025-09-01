import { Router } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

const router = Router();

/** Utils */
function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "30d" });
}

/** GET /api/admin/users?query=&page=1&pageSize=20
 *  Lista utenti con counts basilari.
 */
router.get("/users", async (req, res) => {
  const q = String(req.query.query || "").trim();
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 20);
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
          { profile: { is: { displayName: { contains: q, mode: "insensitive" } } } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: {
        _count: { select: { links: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  res.json({ total, page, pageSize, users });
});

/** GET /api/admin/stats/summary
 *  Ritorna stats globali (utenti, link, click).
 *  Se esiste tabella Click, calcola 7/30 giorni. Altrimenti 0.
 */
router.get("/stats/summary", async (_req, res) => {
  const [usersCount, linksCount] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
  ]);

  // All-time clicks
  let clicksAllTime = 0;
  try {
    // Se esiste colonna clicks su Link (contatore veloce)
    const links = await prisma.link.findMany({ select: { clicks: true } });
    if (links.length) {
      clicksAllTime = links.reduce((a: number, b: any) => a + (b.clicks || 0), 0);
    }
  } catch {
    // Se non esiste la colonna clicks, prova tabella Click
    try {
      clicksAllTime = await prisma.click.count();
    } catch {
      clicksAllTime = 0;
    }
  }

  // 7 / 30 giorni se c'è tabella Click
  let clicks7d = 0, clicks30d = 0;
  try {
    const now = new Date();
    const d7 = new Date(now); d7.setDate(now.getDate() - 7);
    const d30 = new Date(now); d30.setDate(now.getDate() - 30);
    clicks7d = await prisma.click.count({ where: { createdAt: { gte: d7 } } });
    clicks30d = await prisma.click.count({ where: { createdAt: { gte: d30 } } });
  } catch {
    clicks7d = 0; clicks30d = 0;
  }

  res.json({ usersCount, linksCount, clicksAllTime, clicks7d, clicks30d });
});

/** POST /api/admin/impersonate/:userId
 *  Impersona un utente: salva cookie 'token' dell'UTENTE e un cookie 'impersonator'
 *  firmato con l'ID dell'admin, per poter tornare indietro.
 */
router.post("/impersonate/:userId", async (req: any, res) => {
  const targetId = Number(req.params.userId);
  const admin = req.admin; // messo da requireAdmin
  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) return res.status(404).json({ message: "Utente non trovato" });

  const userToken = signToken({ userId: user.id, imp: true, by: admin.id });
  const adminToken = signToken({ id: admin.id, purpose: "impersonator" });

  res
    .cookie("token", userToken, { httpOnly: true, sameSite: "lax", path: "/" })
    .cookie("impersonator", adminToken, { httpOnly: true, sameSite: "lax", path: "/" })
    .json({ ok: true });
});

/** POST /api/admin/stop-impersonate
 *  Torna all'admin originale, leggendo il cookie 'impersonator'.
 */
router.post("/stop-impersonate", async (req, res) => {
  const impersonator = req.cookies?.impersonator;
  if (!impersonator) return res.status(400).json({ message: "Nessuna impersonificazione attiva" });

  try {
    const payload: any = jwt.verify(impersonator, process.env.JWT_SECRET as string);
    const adminId = payload?.id;
    if (!adminId) throw new Error("Token impersonator invalido");

    const token = signToken({ userId: adminId });
    res
      .cookie("token", token, { httpOnly: true, sameSite: "lax", path: "/" })
      .clearCookie("impersonator", { path: "/" })
      .json({ ok: true });
  } catch {
    return res.status(400).json({ message: "Token impersonator non valido" });
  }
});

export default router;