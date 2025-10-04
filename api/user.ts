import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser } from '../lib/shared/auth.js';
import { storage } from '../lib/shared/storage.js';
import { insertProfileSchema, insertLinkSchema } from '../shared/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getCurrentUser(req.headers.cookie);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api/user', '');

  // /api/user/me
  if (pathname === '/me' && req.method === 'GET') {
    const fullUser = await storage.getUserById(user.userId);
    if (!fullUser) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: { 
        id: fullUser.id,
        email: fullUser.email, 
        username: fullUser.username,
        role: fullUser.role,
        mustChangePassword: fullUser.mustChangePassword
      }
    });
    return;
  }

  // /api/user/profile - GET
  if (pathname === '/profile' && req.method === 'GET') {
    try {
      const profile = await storage.getProfile(user.userId);
      res.json(profile || {});
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
    return;
  }

  // /api/user/profile - PUT
  if (pathname === '/profile' && req.method === 'PUT') {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.upsertProfile(user.userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({ message: 'Failed to update profile' });
    }
    return;
  }

  // /api/user/links - GET
  if (pathname === '/links' && req.method === 'GET') {
    try {
      const links = await storage.getLinks(user.userId);
      res.json(links);
    } catch (error) {
      console.error('Get links error:', error);
      res.status(500).json({ message: 'Failed to fetch links' });
    }
    return;
  }

  // /api/user/links - POST
  if (pathname === '/links' && req.method === 'POST') {
    try {
      const linkData = insertLinkSchema.parse(req.body);
      const link = await storage.createLink(user.userId, linkData);
      res.json(link);
    } catch (error) {
      console.error('Create link error:', error);
      res.status(400).json({ message: 'Failed to create link' });
    }
    return;
  }

  // /api/user/links/:id - PATCH
  if (pathname.startsWith('/links/') && req.method === 'PATCH') {
    const linkId = parseInt(pathname.replace('/links/', ''));
    try {
      const linkData = insertLinkSchema.partial().parse(req.body);
      const link = await storage.updateLink(linkId, linkData);
      res.json(link);
    } catch (error) {
      console.error('Update link error:', error);
      res.status(400).json({ message: 'Failed to update link' });
    }
    return;
  }

  // /api/user/links/:id - DELETE
  if (pathname.startsWith('/links/') && req.method === 'DELETE') {
    const linkId = parseInt(pathname.replace('/links/', ''));
    try {
      await storage.deleteLink(linkId);
      res.json({ message: 'Link deleted' });
    } catch (error) {
      console.error('Delete link error:', error);
      res.status(400).json({ message: 'Failed to delete link' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
