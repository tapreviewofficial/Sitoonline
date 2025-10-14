# 🔧 Configurazione Variabili d'Ambiente Vercel

## ⚠️ IMPORTANTE: Configurare TUTTE queste variabili su Vercel

Vai su **Vercel Dashboard** → **Settings** → **Environment Variables** e aggiungi:

### 1. 🔐 JWT Secret (Obbligatorio)
```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```
**Genera con**: `openssl rand -base64 32`

### 2. 📧 Email OVH SMTP (Obbligatorio per invio email)
```
MAIL_USER=info@taptrust.it
MAIL_PASSWORD=[la password OVH SMTP]
```

### 3. 🗄️ Database Supabase (Obbligatorio)
```
DATABASE_URL=postgresql://postgres.ilbtvkfrfkcnlhspxwfm:Envp9U5nsJQjAe00@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```
⚠️ **IMPORTANTE**: Usa il **connection pooler** (porta 6543) con `pgbouncer=true` per Vercel serverless

### 4. 🌐 Frontend URL (Opzionale - per email)
```
FRONTEND_URL=https://your-app.vercel.app
```
O usa la variabile automatica:
```
PUBLIC_ORIGIN=https://${VERCEL_URL}
```

### 5. 📮 SendGrid API Key (Opzionale - alternativa a OVH)
```
SENDGRID_API_KEY=SG.xxxxx
```

## ✅ Checklist Post-Configurazione

1. **Verifica variabili**: Settings → Environment Variables (tutte presenti?)
2. **Redeploy**: Deployments → Redeploy latest deployment
3. **Testa registrazione**: Prova a creare un nuovo account
4. **Testa email**: Richiedi password reset o invia promozione
5. **Controlla logs**: Deployment → View Function Logs (cerca errori)

## 🔍 Debug Comuni

### Email non partono
- ✅ `MAIL_USER` e `MAIL_PASSWORD` configurati correttamente?
- ✅ Password OVH corretta?
- ✅ Controlla logs Vercel per errori SMTP

### Registrazione non funziona
- ✅ `DATABASE_URL` configurato con porta 6543 (pooler)?
- ✅ `JWT_SECRET` configurato (minimo 32 caratteri)?
- ✅ Controlla logs per errori database

### Database clienti vuoto
- ✅ Verifica che `DATABASE_URL` punti al database Supabase corretto
- ✅ Controlla se le tabelle esistono: usa Supabase Dashboard → SQL Editor
- ✅ Verifica logs API per errori INSERT

## 🚨 ATTENZIONE
Dopo aver aggiunto/modificato variabili d'ambiente su Vercel:
**DEVI SEMPRE FARE UN REDEPLOY** affinché le modifiche abbiano effetto!
