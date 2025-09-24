import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { getCurrentUser } from '../server/lib/auth';
import { insertLinkSchema } from '../shared/schema';

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
      const links = await storage.getLinksByUserId(user.userId);
      return res.json(links);
    }

    if (req.method === 'POST') {
      const validation = insertLinkSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid data', errors: validation.error.errors });
      }

      const linkData = { ...validation.data, userId: user.userId };
      const newLink = await storage.createLink(linkData);
      return res.json(newLink);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Links error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}