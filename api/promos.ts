import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { getCurrentUser } from '../server/lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Auth check
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getCurrentUser(token);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const promos = await storage.getPromosByUserId(user.userId);
      return res.json(promos);
    }

    if (req.method === 'POST') {
      // Create promo logic would go here
      return res.status(501).json({ message: 'Not implemented' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Promos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}