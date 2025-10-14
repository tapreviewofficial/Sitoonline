import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
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
      const mailOptions: any = {
        from: `"TapTrust" <${FROM_EMAIL}>`,
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
   * Invia email di promozione attiva
   */
  static async sendPromotionEmail(
    email: string,
    promotionTitle: string,
    promotionDescription: string,
    claimUrl: string,
    businessName: string
  ): Promise<boolean> {
    const subject = `🎁 ${businessName} - Promozione Esclusiva`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-size: 24px; font-weight: bold;">TT</span>
          </div>
          <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapTrust</h1>
        </div>

        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
          <h2 style="color: #CC9900; margin-top: 0;">🎁 Promozione Esclusiva!</h2>
          <p style="color: #cccccc; line-height: 1.6;">
            <strong style="color: #CC9900;">${businessName}</strong> ha una sorpresa per te!
          </p>

          <div style="background: #0a0a0a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #CC9900;">
            <h3 style="color: #CC9900; margin: 0 0 10px 0;">${promotionTitle}</h3>
            <p style="color: #cccccc; margin: 0; line-height: 1.6;">${promotionDescription}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${claimUrl}" 
               style="background-color: #CC9900; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Richiedi la Tua Promozione
            </a>
          </div>

          <p style="color: #888888; font-size: 14px; text-align: center; margin-bottom: 0;">
            Affrettati! L'offerta potrebbe scadere presto.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
          <p>TapTrust - Gestione Recensioni NFC</p>
          <p>Email automatica, non rispondere.</p>
        </div>
      </div>
    `;

    const text = `
      TapTrust - Promozione Esclusiva

      ${businessName} ha una sorpresa per te!

      ${promotionTitle}
      ${promotionDescription}

      Richiedi la tua promozione qui:
      ${claimUrl}

      Affrettati! L'offerta potrebbe scadere presto.

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

      const subject = `🎁 ${promotion.title} - Il tuo QR Code`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #000; font-size: 24px; font-weight: bold;">TT</span>
            </div>
            <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapTrust</h1>
          </div>

          <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
            <h2 style="color: #CC9900; margin-top: 0;">🎁 ${promotion.title}</h2>
            <p style="color: #cccccc; line-height: 1.6;">
              Ciao <strong style="color: #CC9900;">${userName}</strong>,
            </p>
            <p style="color: #cccccc; line-height: 1.6;">
              ${promotion.description}
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <img src="cid:qrcode" alt="QR Code Promozione" style="max-width: 250px; border: 3px solid #CC9900; border-radius: 8px; padding: 10px; background: white;" />
            </div>

            <p style="color: #cccccc; text-align: center; margin: 20px 0; font-size: 14px;">
              Mostra questo QR code in negozio per riscattare la promozione
            </p>

            <div style="background: #0a0a0a; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #888888; margin: 0; font-size: 13px;">Valido fino al: <strong style="color: #CC9900;">${validUntilText}</strong></p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${qrUrl}" 
                 style="background-color: #CC9900; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                Visualizza Online
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
        TapTrust - ${promotion.title}

        Ciao ${userName},

        ${promotion.description}

        Valido fino al: ${validUntilText}

        Link per visualizzare il QR code:
        ${qrUrl}

        Mostra questo QR code in negozio per riscattare la promozione.

        TapTrust - Gestione Recensioni NFC
      `;

      return this.sendEmail({
        to: email,
        subject,
        html,
        text,
        attachments: [{
          content: qrCodeBase64,
          filename: 'qrcode-promozione.png',
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
