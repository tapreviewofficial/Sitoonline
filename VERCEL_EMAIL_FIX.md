# ✅ Fix Email e Database Clienti su Vercel

## 🔍 Problema Risolto

**Sintomo**: Dopo il deploy su Vercel, le email non partivano e i contatti promozionali non venivano salvati nel database clienti.

**Root Cause**: La versione Vercel di `/api/public/:username/claim` (in `api/public.ts`) **NON inviava le email**, a differenza della versione local (`server/routes/promos.ts`).

---

## 🛠️ Modifiche Implementate

### 1. **Aggiunto `sendPromotionQRCode` a `lib/shared/emailService.ts`**
   - Template Luxury Gold completo (oro #d4af37/#b8860b, perla #f5f4f2)
   - Generazione QR code inline con `qrcode` library
   - Supporto attachments con encoding corretto
   - Mittente: "TapTrust™ Concierge"

### 2. **Fix Bug Attachment Email**
   - ❌ `content_id` → ✅ `cid` (standard Nodemailer)
   - ❌ Mancava → ✅ `encoding: 'base64'`
   - Ora il QR code viene renderizzato correttamente inline

### 3. **Aggiornato `api/public.ts` (Vercel)**
   - Importato `sendPromotionQRCode`
   - Invio email dopo creazione ticket
   - Log dettagliati per debugging:
     - `📧 Contatto promozionale salvato: ${email}`
     - `✅ QR Code email sent successfully to ${email}`
     - `⚠️ Failed to send QR Code email to ${email}`

---

## 📋 Checklist Post-Deploy Vercel

### 1. ✅ **Variabili d'Ambiente Configurate**
   Verifica che su Vercel → Settings → Environment Variables ci siano:
   - `MAIL_USER=info@taptrust.it`
   - `MAIL_PASSWORD=[password OVH SMTP]`
   - `DATABASE_URL=postgresql://...` (pooler Supabase porta 6543)
   - `JWT_SECRET=[chiave sicura]`

### 2. ✅ **Redeploy Completato**
   Dopo aver aggiunto/modificato variabili:
   - Vai su Deployments → Latest → **Redeploy**

### 3. ✅ **Test Funzionalità**
   
   **A. Test Email e Database Clienti:**
   1. Vai alla tua pagina pubblica: `https://your-app.vercel.app/ROB` (sostituisci ROB con il tuo username)
   2. Compila il form promozione con un'email di test
   3. Clicca "Richiedi Promozione"
   4. **Verifica Email**: Controlla la casella di posta (anche spam)
      - ✅ Email ricevuta con template Luxury Gold
      - ✅ QR code visibile inline (non come attachment)
      - ✅ Link "Visualizza Online" funzionante
   5. **Verifica Database**: Vai su Dashboard → Tab "Database Clienti"
      - ✅ Il contatto appare nella lista
      - ✅ Email e nome salvati correttamente

   **B. Controlla Vercel Logs:**
   1. Vai su Vercel Dashboard → Deployments → Latest → View Function Logs
   2. Filtra per `/api/public`
   3. Cerca:
      - `✅ QR Code email sent successfully` → Email inviata
      - `📧 Contatto promozionale salvato` → Contatto salvato
      - `❌` o `Error` → Problemi da risolvere

### 4. 🐛 **Troubleshooting**

   **Email non arriva:**
   - ✅ `MAIL_USER` e `MAIL_PASSWORD` configurati su Vercel?
   - ✅ Password OVH corretta?
   - ✅ Controlla logs per errori SMTP: `Error sending QR Code email`
   - ✅ Verifica cartella spam

   **Contatti non salvati:**
   - ✅ `DATABASE_URL` configurato con pooler (porta 6543)?
   - ✅ Controlla logs per: `Error saving promotional contact`
   - ✅ Verifica connessione Supabase su Supabase Dashboard

   **QR code non visibile inline:**
   - ✅ Redeploy effettuato dopo le ultime modifiche?
   - ✅ Client email supporta immagini inline? (prova Gmail/Outlook)

---

## 🎉 Risultato Atteso

Dopo aver completato la checklist:
- ✅ Email Luxury Gold con QR code inline vengono inviate correttamente
- ✅ Contatti promozionali salvati nel database e visibili in Dashboard
- ✅ Link "Visualizza Online" porta alla pagina del QR code funzionante
- ✅ Sistema completamente operativo su Vercel Free Tier

---

## 📝 Note Tecniche

**Files modificati:**
- `lib/shared/emailService.ts` → Aggiunto `sendPromotionQRCode`, fix attachment
- `api/public.ts` → Aggiunto invio email dopo creazione ticket

**Compatibilità:**
- ✅ Vercel Serverless Functions (8/12 function limit)
- ✅ Supabase PostgreSQL con connection pooling
- ✅ OVH SMTP (ssl0.ovh.net:465)
- ✅ Template email responsive (Gmail, Outlook, Apple Mail)
