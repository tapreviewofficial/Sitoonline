# 🚀 TapReview - Guida Deploy Completo Vercel

## ✅ Architettura Ottimizzata per Vercel Free Tier

**Consolidamento completato**: 30 API routes → **8 serverless functions** (sotto il limite di 12)

### 📁 Struttura API Consolidata

```
api/
├── auth.ts          → 7 routes (login, logout, register, reset, change-password)
├── user.ts          → 4 routes (me, profile, links CRUD)
├── analytics.ts     → 3 routes (summary, clicks, links stats)
├── admin.ts         → 4 routes (users, stats, impersonate)
├── promos.ts        → 5 routes (promos CRUD, active, ticket generation)
├── tickets.ts       → 2 routes (status, use)
├── public.ts        → 3 routes (public profile, active-promo, claim)
└── other.ts         → 3 routes (redirect, promotional-contacts, public-pages)
```

**Totale: 31 routes in 8 file** ✅

---

## 📋 Prerequisiti

### 1. Account GitHub
- Se non hai un account, creane uno su [github.com](https://github.com)
- Crea un **nuovo repository vuoto** (NON inizializzare con README/gitignore)

### 2. Account Vercel  
- Registrati su [vercel.com](https://vercel.com) con il tuo account GitHub
- Piano gratuito (Hobby): max 12 serverless functions ✅

### 3. Database Supabase (già configurato)
- Usa il tuo DATABASE_URL esistente
- La connessione pooling è già configurata in `lib/shared/db.ts`

---

## 🎯 Guida Deploy Passo-Passo

### Step 1: Preparazione Repository GitHub

#### 1.1 Inizializza Git (se non già fatto)
```bash
git init
git branch -M main
```

#### 1.2 Aggiungi Remote GitHub
Sostituisci `TUO_USERNAME` e `NOME_REPO` con i tuoi valori:
```bash
git remote add origin https://github.com/TUO_USERNAME/NOME_REPO.git
```

#### 1.3 Commit delle Modifiche
```bash
git add .
git commit -m "Deploy: Consolidated API routes for Vercel (8 functions)"
```

#### 1.4 Push su GitHub
```bash
git push -u origin main
```

Se hai problemi di autenticazione, usa un **Personal Access Token**:
1. Vai su GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera nuovo token con scope `repo`
3. Usa il token come password quando richiesto

---

### Step 2: Deploy su Vercel

#### 2.1 Importa Progetto
1. Vai su [vercel.com/new](https://vercel.com/new)
2. Seleziona il repository GitHub che hai appena pushato
3. Clicca "Import"

#### 2.2 Configura Build Settings
Vercel dovrebbe rilevare automaticamente:
- **Framework Preset**: Vite
- **Build Command**: `vite build` (già configurato in vercel.json)
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

✅ **NON modificare** queste impostazioni, sono già corrette!

#### 2.3 Aggiungi Environment Variables
Clicca "Environment Variables" e aggiungi:

```
DATABASE_URL=postgresql://... (il tuo Supabase pooler URL)
JWT_SECRET=il-tuo-jwt-secret-super-sicuro
SENDGRID_API_KEY=il-tuo-sendgrid-api-key
```

**⚠️ IMPORTANTE**: 
- Usa il **pooler connection string** di Supabase (porta 6543)
- Non committare mai questi valori nel codice!

#### 2.4 Deploy!
1. Clicca "Deploy"
2. Attendi il completamento del build (~2-3 minuti)
3. Vercel ti darà un URL tipo: `https://tuo-progetto.vercel.app`

---

### Step 3: Verifica Funzionamento

#### 3.1 Test API Routes
Apri il browser e testa:
```
https://tuo-progetto.vercel.app/api/me
```
Dovrebbe rispondere: `{"user":null,"impersonating":false}`

#### 3.2 Test Registrazione
```bash
curl -X POST https://tuo-progetto.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

#### 3.3 Test Login
```bash
curl -X POST https://tuo-progetto.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 3.4 Verifica Funzioni Deploy
Vai su Vercel Dashboard → Functions:
- Dovresti vedere **esattamente 8 functions** ✅
- Ogni function corrisponde a un file in `/api`

---

## 🔧 Configurazione Tecnica

### vercel.json (già configurato)
```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {"source": "/api/auth/:path*", "destination": "/api/auth"},
    {"source": "/api/admin/:path*", "destination": "/api/admin"},
    ...
  ]
}
```

I **rewrites** permettono a Vercel di:
- Ricevere richiesta: `/api/auth/login`
- Instradare a: `/api/auth.ts`
- Mantenere il path originale per il routing interno

### Routing Interno (pathname-based)
Ogni file consolidato usa pattern matching per gestire multiple routes:

```typescript
// api/auth.ts esempio
const url = new URL(req.url!, `http://${req.headers.host}`);
const pathname = url.pathname.replace('/api/auth', '');

// pathname = '/login', '/register', '/logout', etc.
if (pathname === '/login' && req.method === 'POST') { ... }
```

---

## 📊 Limiti Vercel Free Tier

| Risorsa | Limite | TapReview |
|---------|--------|-----------|
| Serverless Functions | 12 | ✅ **8** |
| Execution Time | 10s | ✅ ~2-3s |
| Deployments/day | 100 | ✅ |
| Bandwidth | 100 GB | ✅ |
| Build Minutes | 6000/month | ✅ |

---

## 🐛 Troubleshooting

### Errore: "Too many functions"
- **Problema**: Hai più di 12 file in `/api`
- **Soluzione**: Verifica che ci siano solo 8 file `.ts` in `/api`

### Errore: "Database connection failed"
- **Problema**: DATABASE_URL non configurato o errato
- **Soluzione**: 
  1. Verifica env vars su Vercel Dashboard
  2. Usa il pooler URL (porta 6543) di Supabase
  3. Aggiungi `?sslmode=require` alla connection string

### Errore: "Route not found" (404)
- **Problema**: Rewrites non funzionanti
- **Soluzione**: Verifica che `vercel.json` contenga tutti i rewrites

### Build fallisce con "Module not found"
- **Problema**: Dipendenze mancanti
- **Soluzione**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  git add package-lock.json
  git commit -m "Update dependencies"
  git push
  ```

---

## 🔄 Aggiornamenti Futuri

### Deploy Automatico
Ogni push su `main` trigghera automaticamente un nuovo deploy su Vercel!

```bash
# Fai modifiche
git add .
git commit -m "Feature: nuova funzionalità"
git push

# Vercel deploya automaticamente in ~2 minuti
```

### Rollback Versione Precedente
1. Vai su Vercel Dashboard → Deployments
2. Trova il deployment precedente
3. Clicca "..." → "Promote to Production"

---

## 📚 Risorse

- [Vercel Docs - Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Docs - Rewrites](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Supabase Pooler Connection](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

## ✅ Checklist Finale

- [ ] Repository GitHub creato e pushato
- [ ] Progetto importato su Vercel
- [ ] Environment variables configurate (DATABASE_URL, JWT_SECRET, SENDGRID_API_KEY)
- [ ] Build completato con successo
- [ ] Verifica: solo 8 functions nella dashboard Vercel
- [ ] Test API routes (almeno `/api/me` e `/api/auth/login`)
- [ ] App frontend accessibile e funzionante

---

## 🎉 Congratulazioni!

TapReview è ora **100% deployato su Vercel** con:
- ✅ 8 serverless functions (sotto il limite free tier)
- ✅ Database Supabase PostgreSQL con pooling
- ✅ Autenticazione JWT con cookie
- ✅ Sistema promozionale completo
- ✅ Analytics e admin panel
- ✅ Deploy automatico su ogni commit

**Dominio produzione**: `https://tuo-progetto.vercel.app`

Puoi ora condividere l'app con i tuoi clienti! 🚀
