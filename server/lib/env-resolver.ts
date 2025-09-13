// Auto-risoluzione delle variabili di ambiente per Supabase
// Configura automaticamente DATABASE_URL dall'integrazione Replit

console.log('🔧 Auto-configurazione variabili Supabase...');

// Se DATABASE_URL non è configurata, la recupera dall'integrazione Supabase
if (!process.env.DATABASE_URL) {
  const supabaseDbUrl = process.env.SUPABASE_DB_POOLER_URL || process.env.SUPABASE_DB_URL || process.env.SUPABASE_DATABASE_URL;
  
  if (supabaseDbUrl) {
    // Assicura che l'URL abbia SSL attivo per Supabase
    const urlWithSsl = supabaseDbUrl.includes('?') 
      ? `${supabaseDbUrl}&sslmode=require` 
      : `${supabaseDbUrl}?sslmode=require`;
    process.env.DATABASE_URL = urlWithSsl;
    console.log('✅ DATABASE_URL auto-configurata da integrazione Supabase con SSL');
  } else {
    // Fallback per configurazione manuale
    console.log('⚠️  DATABASE_URL non trovata - richiesta configurazione manuale');
  }
} else {
  // Assicura SSL anche per configurazioni manuali Supabase
  const currentUrl = process.env.DATABASE_URL;
  if (currentUrl.includes('supabase.com') && !currentUrl.includes('sslmode=require')) {
    const urlWithSsl = currentUrl.includes('?') 
      ? `${currentUrl}&sslmode=require` 
      : `${currentUrl}?sslmode=require`;
    process.env.DATABASE_URL = urlWithSsl;
    console.log('✅ SSL aggiunto alla DATABASE_URL Supabase esistente');
  } else {
    console.log('✅ DATABASE_URL già configurata');
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