import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser } from '../lib/shared/auth.js';
import { storage } from '../lib/shared/storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = await getCurrentUser(req.headers.cookie);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api/analytics', '');

  // /api/analytics/summary
  if (pathname === '/summary') {
    try {
      const stats = await storage.getClickStats(user.userId);
      res.json(stats);
    } catch (error) {
      console.error('Analytics summary error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
    return;
  }

  // /api/analytics/clicks
  if (pathname === '/clicks') {
    try {
      const { range = '7d', timezone = 'Europe/Rome', groupBy = 'none', linkId } = req.query;
      
      const validRanges = ['1d', '7d', '1w', '1m', '3m', '6m', '1y', 'all'];
      if (!validRanges.includes(range as string)) {
        return res.status(400).json({ message: 'Invalid range parameter' });
      }

      const data = await storage.getClicksTimeSeries(user.userId, {
        range: range as '1d' | '7d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'all',
        timezone: timezone as string,
        groupBy: groupBy as 'none' | 'link',
        linkId: linkId ? parseInt(linkId as string) : undefined
      });
      
      res.json(data);
    } catch (error) {
      console.error('Analytics clicks time series error:', error);
      res.status(500).json({ message: 'Failed to fetch clicks analytics' });
    }
    return;
  }

  // /api/analytics/links
  if (pathname === '/links') {
    try {
      const linkStats = await storage.getLinkStats(user.userId);
      res.json(linkStats);
    } catch (error) {
      console.error('Analytics links error:', error);
      res.status(500).json({ message: 'Failed to fetch link analytics' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
