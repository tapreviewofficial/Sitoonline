import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser } from '../lib/shared/auth.js';
import { getDatabase } from '../lib/shared/db.js';
import { tickets } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api/tickets', '');

  // /api/tickets/:code/status - GET
  const statusMatch = pathname.match(/^\/([^/]+)\/status$/);
  if (statusMatch && req.method === 'GET') {
    const code = statusMatch[1];
    const db = getDatabase();
    
    const ticket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.code, code))
      .limit(1);
      
    if (!ticket.length) {
      return res.status(404).json({ error: 'Ticket non trovato' });
    }
    
    res.json(ticket[0]);
    return;
  }

  // /api/tickets/:code/use - POST
  const useMatch = pathname.match(/^\/([^/]+)\/use$/);
  if (useMatch && req.method === 'POST') {
    const user = await getCurrentUser(req.headers.cookie);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const code = useMatch[1];
    const db = getDatabase();
    
    const ticket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.code, code))
      .limit(1);
      
    if (!ticket.length) {
      return res.status(404).json({ error: 'Ticket non trovato' });
    }

    if (ticket[0].status === 'USED') {
      return res.status(400).json({ error: 'Ticket già utilizzato' });
    }

    await db
      .update(tickets)
      .set({ status: 'USED', usedAt: new Date() })
      .where(eq(tickets.code, code));
    
    res.json({ ok: true, message: 'Ticket utilizzato con successo' });
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
