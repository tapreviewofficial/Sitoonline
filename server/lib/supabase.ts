// Usiamo Drizzle direttamente con Supabase PostgreSQL 
// Come suggerito dall'integrazione Replit
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL non configurata');
}

console.log('🔗 Connessione a Supabase PostgreSQL via Drizzle...');

// Client PostgreSQL per Supabase
const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });

// Export dello schema per uso diretto
export * from './schema';

// Test connessione
client`SELECT 1 as test`.then(() => {
  console.log('✅ Database Supabase connesso!');
}).catch((error: any) => {
  console.error('❌ Errore connessione database:', error.message);
});