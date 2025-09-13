// Auto-risoluzione delle variabili di ambiente per Supabase
// Configura automaticamente DATABASE_URL dall'integrazione Replit

console.log('🔧 Auto-configurazione variabili Supabase...');

// Auto-configurazione DATABASE_URL: priorità al POOLER per maggiore affidabilità
// Priorità: SUPABASE_DB_POOLER_URL > SUPABASE_DATABASE_URL > SUPABASE_DB_URL
if (!process.env.DATABASE_URL) {
  const poolerDbUrl = process.env.SUPABASE_DB_POOLER_URL; 
  const fallbackUrl = process.env.SUPABASE_DATABASE_URL;
  const directDbUrl = process.env.SUPABASE_DB_URL;
  
  const supabaseDbUrl = poolerDbUrl || fallbackUrl || directDbUrl;
  
  if (supabaseDbUrl) {
    // Aggiungi SSL solo se non presente
    const urlWithSsl = supabaseDbUrl.includes('sslmode=') 
      ? supabaseDbUrl
      : (supabaseDbUrl.includes('?') ? `${supabaseDbUrl}&sslmode=require` : `${supabaseDbUrl}?sslmode=require`);
    
    process.env.DATABASE_URL = urlWithSsl;
    const connectionType = poolerDbUrl ? 'pooler' : (fallbackUrl ? 'fallback' : 'diretta');
    console.log(`✅ DATABASE_URL auto-configurata da integrazione Supabase (${connectionType})`);
    
    // Se usiamo il pooler, rimuovi le altre variabili per evitare confusione
    if (poolerDbUrl) {
      delete process.env.SUPABASE_DB_URL;
      delete process.env.SUPABASE_DATABASE_URL;
    }
  } else {
    console.log('⚠️  DATABASE_URL non trovata - richiesta configurazione manuale');
  }
} else {
  let currentUrl = process.env.DATABASE_URL;
  
  // CLEAN-UP AUTOMATICO: rimuovi virgolette problematiche dai Replit Secrets
  if (currentUrl.startsWith('"') && currentUrl.endsWith('"')) {
    currentUrl = currentUrl.slice(1, -1);
    console.log('🔧 AUTO-FIX: Rimosse virgolette problematiche dalla DATABASE_URL');
  }
  
  // Verifica che sia effettivamente Supabase (supporta sia .com che .co)
  if (!currentUrl.includes('supabase.')) {
    console.log('⚠️  WARNING: DATABASE_URL non sembra essere Supabase');
  }
  
  // Rileva tentativi di conversione pooler->diretto (per debug)
  if (currentUrl.includes('pooler.') && currentUrl.includes(':5432')) {
    console.warn('⚠️  PROBLEMA: DATABASE_URL sembra convertita da pooler a diretto');
  }
  
  // CONVERSIONE AUTOMATICA: pooler -> connessione diretta (risolve problemi di rete)
  if (currentUrl.includes('pooler.supabase.') || currentUrl.includes(':6543')) {
    currentUrl = currentUrl
      .replace('.pooler.supabase.com', '.supabase.com')  // Rimuovi solo "pooler."
      .replace(':6543', ':5432')                         // Porta diretta
      .replace('?pgbouncer=true', '')                   // Rimuovi parametri pooler
      .replace('&pgbouncer=true', '');
    console.log('🔄 AUTO-FIX: Convertito da pooler a connessione diretta Supabase');
    
    // Rimuovi le altre variabili per evitare override accidentali
    delete process.env.SUPABASE_DB_URL;
    delete process.env.SUPABASE_DATABASE_URL;
  }
  
  // Aggiungi SSL se necessario
  if (currentUrl.includes('supabase.') && !currentUrl.includes('sslmode=')) {
    const urlWithSsl = currentUrl.includes('?') 
      ? `${currentUrl}&sslmode=require` 
      : `${currentUrl}?sslmode=require`;
    process.env.DATABASE_URL = urlWithSsl;
    console.log('✅ SSL aggiunto alla DATABASE_URL Supabase');
  } else {
    process.env.DATABASE_URL = currentUrl;
    console.log('✅ DATABASE_URL configurata correttamente');
  }
}

// Verifica che abbiamo tutte le variabili necessarie
const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Variabili mancanti:', missingVars.join(', '));
} else {
  console.log('✅ Tutte le variabili di ambiente configurate');
}

export const isConfigured = missingVars.length === 0;