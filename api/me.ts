import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(200).json({ user: null, impersonating: false });
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = payload?.userId || payload?.id;
    
    const user = await storage.getUserById(userId);
    const impersonating = Boolean(payload?.imp);
    
    if (user) {
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }, 
        impersonating 
      });
    } else {
      res.json({ user: null, impersonating: false });
    }
  } catch {
    res.json({ user: null, impersonating: false });
  }
}