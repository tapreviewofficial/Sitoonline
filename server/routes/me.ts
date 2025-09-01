import { Router } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req: any, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(200).json({ user: null, impersonating: false });

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = payload?.userId || payload?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, role: true },
    });

    const impersonating = Boolean(payload?.imp);
    res.json({ user, impersonating });
  } catch {
    res.json({ user: null, impersonating: false });
  }
});

export default router;