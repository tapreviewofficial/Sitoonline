import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql as drizzleSql } from 'drizzle-orm';
import * as schema from '../../shared/schema.js';

// Funzione per creare connessione database serverless-friendly
let cachedDb: ReturnType<typeof drizzle> | null = null;
let cachedClient: ReturnType<typeof postgres> | null = null;

export function getDatabase() {
  // Riusa connessione in cache per serverless (warm starts)
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not configured');
  }

  // Configurazione ottimizzata per serverless (connection pooling)
  cachedClient = postgres(databaseUrl, {
    ssl: 'require' as const,
    max: 1, // Serverless: 1 connessione per funzione
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // Disabilita per PgBouncer
    onnotice: () => {},
  });
  
  cachedDb = drizzle(cachedClient, { schema });

  return cachedDb;
}

// Inizializza search_path - DEVE essere chiamata all'inizio di ogni handler API
// Esegue SET search_path ad ogni chiamata per garantire correttezza con PgBouncer
export async function initSearchPath(): Promise<void> {
  const db = getDatabase();
  await db.execute(drizzleSql`SET search_path TO tapreview, public`);
}

// Export schema
export * from '../../shared/schema.js';
