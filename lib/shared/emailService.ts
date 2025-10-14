import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
    encoding?: string;
    cid?: string;
  }>;
}

// Configurazione transporter SMTP OVH (compatibile con Vercel serverless)
function createTransporter() {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    console.warn('MAIL_USER or MAIL_PASSWORD not configured');
    return null;
  }

  return nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.MAIL_USER,      // info@taptrust.it
      pass: process.env.MAIL_PASSWORD   // secret
    },
    tls: { 
      rejectUnauthorized: true 
    }
  });
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn('Email transporter not configured, skipping email send');
    return false;
  }

  try {
    const fromName = params.fromName || 'TapTrust';
    const mailOptions: any = {
      from: `"${fromName}" <${process.env.MAIL_USER}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text || 'TapTrust notification',
      headers: {
        'X-TapTrust-App': 'taptrust-1.0'
      }
    };
    
    if (params.attachments && params.attachments.length > 0) {
      mailOptions.attachments = params.attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${params.to} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('❌ Errore invio email:', error);
    return false;
  }
}

export function generatePasswordResetEmail(resetLink: string, username: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reimposta Password - TapTrust</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a0a0a; color: #CC9900; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; background: #CC9900; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TapTrust</h1>
        </div>
        <div class="content">
          <h2>Reimpostazione Password</h2>
          <p>Ciao <strong>${username}</strong>,</p>
          <p>Hai richiesto la reimpostazione della password per il tuo account TapTrust.</p>
          <p>Clicca sul pulsante qui sotto per creare una nuova password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" class="button">Reimposta Password</a>
          </p>
          <p><strong>Importante:</strong> Questo link è valido per 1 ora. Se non hai richiesto tu questa reimpostazione, ignora questa email.</p>
          <p>Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">${resetLink}</p>
        </div>
        <div class="footer">
          <p>© 2024 TapTrust. Tutti i diritti riservati.</p>
          <p>Questa è una email automatica, non rispondere a questo messaggio.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
TapTrust - Reimpostazione Password

Ciao ${username},

Hai richiesto la reimpostazione della password per il tuo account TapTrust.

Clicca su questo link per creare una nuova password:
${resetLink}

Questo link è valido per 1 ora. Se non hai richiesto tu questa reimpostazione, ignora questa email.

© 2024 TapTrust
  `;

  return { html, text };
}

/**
 * Invia email con QR code per promozione - Template Luxury Gold
 */
export async function sendPromotionQRCode(
  email: string,
  userName: string,
  qrUrl: string,
  promotion: {
    title: string;
    description: string;
    validUntil?: Date | null;
  }
): Promise<boolean> {
  try {
    // Genera QR code dall'URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
      color: {
        dark: '#CC9900',
        light: '#0a0a0a'
      }
    });

    const qrCodeBase64 = qrCodeDataUrl.split(',')[1];
    const validUntilText = promotion.validUntil 
      ? new Date(promotion.validUntil).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'Fino ad esaurimento';

    const subject = `Il tuo invito TapTrust™ Gold è pronto`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TapTrust™ Gold Invitation</title>
      </head>
      <body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                    background-color:#f5f4f2;
                    color:#1a1a1a;
                    max-width:600px;
                    margin:auto;
                    padding:40px 30px;
                    border-radius:20px;">
          
          <div style="text-align:center;margin-bottom:30px;">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#d4af37,#b8860b);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(212,175,55,0.3);">
              <span style="color:#000;font-size:32px;font-weight:700;letter-spacing:-1px;">TT</span>
            </div>
            <h2 style="margin:0;font-weight:600;font-size:22px;letter-spacing:0.5px;color:#000;">TapTrust™ Gold Invitation</h2>
          </div>

          <div style="background-color:#fff;
                      border-radius:16px;
                      padding:30px;
                      box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            
            <p style="font-size:16px;line-height:1.6;margin-bottom:20px;color:#1a1a1a;">
              Ciao <strong>${userName}</strong>,
            </p>

            <p style="font-size:15px;line-height:1.6;margin-bottom:25px;color:#333;">
              Ti diamo il benvenuto in un'esperienza riservata. La tua <strong style="background:linear-gradient(90deg,#d4af37,#b8860b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">TapTrust™ Gold Card</strong> è pronta.
            </p>

            <div style="background:linear-gradient(135deg,rgba(212,175,55,0.05),rgba(184,134,11,0.05));
                        border-left:3px solid #d4af37;
                        padding:20px;
                        border-radius:8px;
                        margin:25px 0;">
              <h3 style="margin:0 0 10px 0;font-size:17px;font-weight:600;color:#000;">${promotion.title}</h3>
              <p style="margin:0;font-size:15px;line-height:1.5;color:#555;">${promotion.description}</p>
            </div>

            <div style="text-align:center;margin:30px 0;">
              <img src="cid:qrcode" alt="QR Code Gold" style="max-width:240px;border:3px solid #d4af37;border-radius:12px;padding:12px;background:#fff;box-shadow:0 4px 12px rgba(212,175,55,0.2);" />
            </div>

            <p style="font-size:14px;color:#666;text-align:center;margin:20px 0;line-height:1.5;">
              Presenta questo QR code per accedere ai vantaggi esclusivi riservati ai membri Gold
            </p>

            <div style="background:linear-gradient(135deg,rgba(212,175,55,0.08),rgba(184,134,11,0.08));
                        padding:15px;
                        border-radius:8px;
                        margin:20px 0;
                        text-align:center;">
              <p style="color:#666;margin:0;font-size:13px;">Valido fino al: <strong style="color:#b8860b;">${validUntilText}</strong></p>
            </div>

            <div style="text-align:center;margin:35px 0 25px 0;">
              <a href="${qrUrl}"
                 style="background:linear-gradient(90deg,#d4af37,#b8860b);
                        color:#000;
                        font-weight:600;
                        text-decoration:none;
                        padding:12px 32px;
                        border-radius:10px;
                        font-size:14px;
                        letter-spacing:0.3px;
                        display:inline-block;
                        box-shadow:0 3px 10px rgba(212,175,55,0.25);">
                 Visualizza Online
              </a>
            </div>

            <p style="font-size:13px;color:#666;text-align:center;margin-top:40px;line-height:1.5;">
              Questo invito è personale e non trasferibile.<br>
              <span style="font-weight:500;color:#888;">— TapTrust™ Concierge</span>
            </p>
          </div>

          <div style="text-align:center;margin-top:25px;">
            <p style="font-size:12px;color:#999;margin:5px 0;">www.taptrust.it</p>
            <p style="font-size:11px;color:#aaa;margin:5px 0;">Questa comunicazione è destinata esclusivamente a te.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
TapTrust™ Gold Invitation

Ciao ${userName},

Ti diamo il benvenuto in un'esperienza riservata. La tua TapTrust™ Gold Card è pronta.

${promotion.title}
${promotion.description}

Valido fino al: ${validUntilText}

Presenta questo QR code per accedere ai vantaggi esclusivi riservati ai membri Gold.

Link per visualizzare online:
${qrUrl}

Questo invito è personale e non trasferibile.
— TapTrust™ Concierge

www.taptrust.it
    `;

    return sendEmail({
      to: email,
      subject,
      html,
      text,
      fromName: 'TapTrust™ Concierge',
      attachments: [{
        content: qrCodeBase64,
        filename: 'qrcode-gold.png',
        type: 'image/png',
        disposition: 'inline',
        encoding: 'base64',
        cid: 'qrcode'
      }]
    });
  } catch (error) {
    console.error('Error sending promotion QR code email:', error);
    return false;
  }
}
