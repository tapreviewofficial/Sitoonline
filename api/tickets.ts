import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCurrentUser } from '../lib/shared/auth.js';
import { getDatabase } from '../lib/shared/db.js';
import { tickets, scanLogs } from '../shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import { checkRateLimit, RATE_LIMITS } from '../lib/shared/rateLimit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  let pathname = url.pathname.replace('/api/tickets', '');
  if (pathname.startsWith('/api/')) pathname = pathname.replace('/api', '');

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

  // /api/tickets/:code/use - POST (with idempotency, rate limiting, audit logging)
  const useMatch = pathname.match(/^\/([^/]+)\/use$/);
  if (useMatch && req.method === 'POST') {
    const user = await getCurrentUser(req.headers.cookie);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const code = useMatch[1];
    
    // Rate limiting: prevent abuse
    const rateLimitKey = `ticket-redeem:${user.userId}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.TICKET_REDEEM);
    
    if (!rateLimit.allowed) {
      res.setHeader('Retry-After', rateLimit.retryAfter?.toString() || '60');
      return res.status(429).json({ 
        error: 'Too many redemption attempts. Please try again later.',
        retryAfter: rateLimit.retryAfter 
      });
    }
    
    const db = getDatabase();
    
    try {
      // Use transaction with conditional update for true idempotency and race-condition prevention
      let ticketId: number;
      let wasAlreadyUsed = false;
      
      await db.transaction(async (tx) => {
        // First get the ticket to check existence
        const ticket = await tx
          .select()
          .from(tickets)
          .where(eq(tickets.code, code))
          .limit(1);
          
        if (!ticket.length) {
          throw new Error('TICKET_NOT_FOUND');
        }

        ticketId = ticket[0].id;
        
        // If already used, set flag and skip update
        if (ticket[0].status === 'USED') {
          wasAlreadyUsed = true;
          return;
        }

        // CRITICAL: Atomic conditional update - only update if status is still 'ACTIVE'
        // This prevents race conditions where two requests try to redeem simultaneously
        const updateResult = await tx
          .update(tickets)
          .set({ status: 'USED', usedAt: new Date() })
          .where(
            sql`${tickets.code} = ${code} AND ${tickets.status} = 'ACTIVE'`
          );
        
        // If update affected 0 rows, another request already redeemed it
        // @ts-ignore - Drizzle returns rowCount in some configurations
        if (updateResult?.rowCount === 0) {
          wasAlreadyUsed = true;
          return;
        }
        
        // Audit logging only on successful redemption
        await tx.insert(scanLogs).values({
          ticketId: ticket[0].id,
          userId: user.userId,
          result: 'SUCCESS',
          meta: JSON.stringify({ 
            ip: req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown'
          })
        });
      });
      
      // Check if ticket was already used (idempotent response)
      if (wasAlreadyUsed) {
        return res.status(400).json({ error: 'Ticket già utilizzato' });
      }
      
      res.json({ ok: true, message: 'Ticket utilizzato con successo' });
    } catch (error: any) {
      if (error.message === 'TICKET_NOT_FOUND') {
        return res.status(404).json({ error: 'Ticket non trovato' });
      }
      console.error('Ticket redemption error:', error);
      res.status(500).json({ error: 'Errore durante l\'utilizzo del ticket' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
