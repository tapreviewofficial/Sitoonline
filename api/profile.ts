import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { getCurrentUser } from '../server/lib/auth';
import { insertProfileSchema } from '../shared/schema';

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
      const profile = await storage.getProfileByUserId(user.userId);
      return res.json(profile);
    }

    if (req.method === 'PUT') {
      const validation = insertProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid data', errors: validation.error.errors });
      }

      const profileData = { ...validation.data, userId: user.userId };
      const updatedProfile = await storage.updateProfile(user.userId, profileData);
      return res.json(updatedProfile);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}