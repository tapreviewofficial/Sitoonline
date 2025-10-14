import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  fromName?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
    content_id?: string;
  }>;
}

const FROM_EMAIL = process.env.MAIL_USER || 'info@taptrust.it';

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

export class EmailService {
  
  /**
   * Invia email generica
   */
  static async sendEmail(params: EmailParams): Promise<boolean> {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.warn('Email transporter not configured, skipping email send');
      return false;
    }

    try {
      const fromName = params.fromName || 'TapTrust';
      const mailOptions: any = {
        from: `"${fromName}" <${FROM_EMAIL}>`,
        to: params.to,
        subject: params.subject,
        text: params.text || 'TapTrust notification',
        html: params.html || `<p>TapTrust notification</p>`,
        headers: {
          'X-TapTrust-App': 'taptrust-1.0'
        }
      };
      
      // Aggiungi attachment solo se presente
      if (params.attachments && params.attachments.length > 0) {
        mailOptions.attachments = params.attachments;
      }

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${params.to} (Message ID: ${info.messageId})`);
      return true;
    } catch (error) {
      console.error('❌ Email error:', error);
      return false;
    }
  }

  /**
   * Invia email di reset password
   */
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    const subject = 'TapTrust - Ripristino Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-size: 24px; font-weight: bold;">TT</span>
          </div>
          <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapTrust</h1>
        </div>
        
        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
          <h2 style="color: #CC9900; margin-top: 0;">Ripristino Password</h2>
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 25px;">
            Hai richiesto il ripristino della password per il tuo account TapTrust.
            Clicca sul pulsante qui sotto per impostare una nuova password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #CC9900; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Ripristina Password
            </a>
          </div>
          
          <p style="color: #888888; font-size: 14px; margin-bottom: 0;">
            Questo link scadrà tra 1 ora per motivi di sicurezza.<br>
            Se non hai richiesto il ripristino, ignora questa email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
          <p>TapTrust - Gestione Recensioni NFC</p>
          <p>Email automatica, non rispondere.</p>
        </div>
      </div>
    `;

    const text = `
      TapTrust - Ripristino Password
      
      Hai richiesto il ripristino della password per il tuo account TapTrust.
      
      Vai a questo link per impostare una nuova password:
      ${resetUrl}
      
      Questo link scadrà tra 1 ora per motivi di sicurezza.
      Se non hai richiesto il ripristino, ignora questa email.
      
      TapTrust - Gestione Recensioni NFC
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /**
   * Invia email di invito con QR code
   */
  static async sendInvitationEmail(
    email: string,
    invitationUrl: string,
    userName: string,
    businessName: string
  ): Promise<boolean> {
    try {
      // Genera QR code
      const qrCodeDataUrl = await QRCode.toDataURL(invitationUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 300,
        color: {
          dark: '#CC9900',
          light: '#0a0a0a'
        }
      });

      const qrCodeBase64 = qrCodeDataUrl.split(',')[1];

      const subject = `${businessName} ti invita su TapTrust`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #000; font-size: 24px; font-weight: bold;">TT</span>
            </div>
            <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapTrust</h1>
          </div>

          <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
            <h2 style="color: #CC9900; margin-top: 0;">Hai ricevuto un invito!</h2>
            <p style="color: #cccccc; line-height: 1.6;">
              Ciao <strong style="color: #CC9900;">${userName}</strong>,
            </p>
            <p style="color: #cccccc; line-height: 1.6;">
              <strong style="color: #CC9900;">${businessName}</strong> ti ha invitato a lasciare una recensione su TapTrust.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <img src="cid:qrcode" alt="QR Code" style="max-width: 200px; border: 3px solid #CC9900; border-radius: 8px; padding: 10px; background: white;" />
            </div>

            <p style="color: #cccccc; text-align: center; margin: 20px 0;">
              Scansiona il QR code o clicca sul pulsante qui sotto:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" 
                 style="background-color: #CC9900; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Lascia una Recensione
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
            <p>TapTrust - Gestione Recensioni NFC</p>
            <p>Email automatica, non rispondere.</p>
          </div>
        </div>
      `;

      const text = `
        TapTrust - Invito a lasciare una recensione

        Ciao ${userName},

        ${businessName} ti ha invitato a lasciare una recensione su TapTrust.

        Clicca su questo link per lasciare la tua recensione:
        ${invitationUrl}

        TapTrust - Gestione Recensioni NFC
      `;

      return this.sendEmail({
        to: email,
        subject,
        html,
        text,
        attachments: [{
          content: qrCodeBase64,
          filename: 'qrcode.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'qrcode'
        }]
      });
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return false;
    }
  }

  /**
   * Invia email di promozione attiva - Template Luxury Gold
   */
  static async sendPromotionEmail(
    email: string,
    promotionTitle: string,
    promotionDescription: string,
    claimUrl: string,
    businessName: string
  ): Promise<boolean> {
    const subject = `Il tuo invito personale TapTrust™ Gold è pronto.`;
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
              Ti diamo il benvenuto in un'esperienza riservata.
            </p>

            <p style="font-size:15px;line-height:1.6;margin-bottom:25px;color:#333;">
              La tua <strong style="background:linear-gradient(90deg,#d4af37,#b8860b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">TapTrust™ Gold Card</strong> è un invito personale, dedicato solo a pochi membri selezionati.
            </p>

            <div style="background:linear-gradient(135deg,rgba(212,175,55,0.05),rgba(184,134,11,0.05));
                        border-left:3px solid #d4af37;
                        padding:20px;
                        border-radius:8px;
                        margin:25px 0;">
              <h3 style="margin:0 0 10px 0;font-size:17px;font-weight:600;color:#000;">${promotionTitle}</h3>
              <p style="margin:0;font-size:15px;line-height:1.5;color:#555;">${promotionDescription}</p>
            </div>

            <p style="font-size:15px;line-height:1.6;margin-bottom:25px;color:#333;">
              Con questa card potrai accedere a <strong>vantaggi esclusivi</strong> e a un canale preferenziale nei locali partner TapTrust™.
            </p>

            <div style="text-align:center;margin:40px 0;">
              <a href="${claimUrl}"
                 style="background:linear-gradient(90deg,#d4af37,#b8860b);
                        color:#000;
                        font-weight:600;
                        text-decoration:none;
                        padding:14px 36px;
                        border-radius:12px;
                        font-size:15px;
                        letter-spacing:0.4px;
                        display:inline-block;
                        box-shadow:0 4px 12px rgba(212,175,55,0.3);
                        transition:all 0.3s ease;">
                 Attiva il tuo invito
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

Ti diamo il benvenuto in un'esperienza riservata.

La tua TapTrust™ Gold Card è un invito personale, dedicato solo a pochi membri selezionati.

${promotionTitle}
${promotionDescription}

Con questa card potrai accedere a vantaggi esclusivi e a un canale preferenziale nei locali partner TapTrust™.

Attiva il tuo invito:
${claimUrl}

Questo invito è personale e non trasferibile.
— TapTrust™ Concierge

www.taptrust.it
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
      fromName: 'TapTrust™ Concierge'
    });
  }

  /**
   * Invia email con QR code per promozione
   */
  static async sendPromotionQRCode(
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

      return this.sendEmail({
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
          content_id: 'qrcode'
        }]
      });
    } catch (error) {
      console.error('Error sending promotion QR code email:', error);
      return false;
    }
  }

  /**
   * Invia email di test per verificare la configurazione
   */
  static async sendTestEmail(email: string): Promise<boolean> {
    const subject = 'Test TapTrust - Email Funzionante! 🎉';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-size: 24px; font-weight: bold;">TT</span>
          </div>
          <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapTrust</h1>
        </div>
        
        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
          <h2 style="color: #CC9900; margin-top: 0;">🎉 Test Riuscito!</h2>
          <p style="color: #cccccc; line-height: 1.6;">
            Congratulazioni! Il sistema email di TapTrust (OVH SMTP) funziona correttamente.
          </p>
          <p style="color: #cccccc; line-height: 1.6;">
            Puoi ora:
          </p>
          <ul style="color: #cccccc; line-height: 1.8;">
            <li>Inviare email di reset password</li>
            <li>Mandare inviti ai clienti</li>
            <li>Comunicare promozioni e offerte</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
          <p>TapTrust - Sistema Email Attivo</p>
        </div>
      </div>
    `;

    const text = `
      TapTrust - Test Email Riuscito!

      Congratulazioni! Il sistema email di TapTrust (OVH SMTP) funziona correttamente.

      TapTrust - Sistema Email Attivo
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }
}
