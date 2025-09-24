import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { getCurrentUser } from '../../server/lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Auth check
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await getCurrentUser(token);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (req.method === 'GET') {
      const q = String(req.query.query || '').trim();
      const page = Number(req.query.page || 1);
      const pageSize = Number(req.query.pageSize || 20);
      
      const result = await storage.getAdminUsers(q, page, pageSize);
      return res.json(result);
    }

    if (req.method === 'POST') {
      // Create user logic would go here
      return res.status(501).json({ message: 'Not implemented' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}