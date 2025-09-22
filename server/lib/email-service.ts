import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

// Configura SendGrid con API key e residenza EU
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configura residenza dati EU per GDPR compliance
try {
  (sgMail as any).setDataResidency('eu');
  console.log("✅ SendGrid configured with EU data residency");
} catch (error) {
  console.warn("⚠️ Could not set EU data residency, check SendGrid configuration");
}

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const FROM_EMAIL = 'tapreviewofficial@gmail.com'; // Sender verificato

export class EmailService {
  
  /**
   * Invia email generica
   */
  static async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      const msg = {
        to: params.to,
        from: FROM_EMAIL,
        subject: params.subject,
        ...(params.text && { text: params.text }),
        ...(params.html && { html: params.html }),
      };

      await sgMail.send(msg as any);
      console.log(`Email sent successfully to ${params.to}`);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  /**
   * Invia email di reset password
   */
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    const subject = 'TapReview - Ripristino Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-size: 24px; font-weight: bold;">TR</span>
          </div>
          <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapReview</h1>
        </div>
        
        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
          <h2 style="color: #CC9900; margin-top: 0;">Ripristino Password</h2>
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 25px;">
            Hai richiesto il ripristino della password per il tuo account TapReview.
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
          <p>TapReview - Gestione Recensioni NFC</p>
          <p>Email automatica, non rispondere.</p>
        </div>
      </div>
    `;

    const text = `
      TapReview - Ripristino Password
      
      Hai richiesto il ripristino della password per il tuo account TapReview.
      
      Vai a questo link per impostare una nuova password:
      ${resetUrl}
      
      Questo link scadrà tra 1 ora per motivi di sicurezza.
      Se non hai richiesto il ripristino, ignora questa email.
      
      TapReview - Gestione Recensioni NFC
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /**
   * Invia QR code per promozione
   */
  static async sendPromotionQRCode(email: string, username: string, qrCodeUrl: string, promotionDetails: {
    title: string;
    description: string;
    validUntil?: Date;
  }): Promise<boolean> {
    
    const subject = `🎉 ${promotionDetails.title} - Il tuo QR Code TapReview`;
    const validUntilText = promotionDetails.validUntil 
      ? `Valido fino al ${promotionDetails.validUntil.toLocaleDateString('it-IT')}`
      : 'Sempre valido';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-size: 24px; font-weight: bold;">TR</span>
          </div>
          <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapReview</h1>
        </div>
        
        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
          <h2 style="color: #CC9900; margin-top: 0;">🎉 ${promotionDetails.title}</h2>
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 20px;">
            Ciao <strong style="color: #CC9900;">${username}</strong>!
          </p>
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 25px;">
            ${promotionDetails.description}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #ffffff; padding: 20px; border-radius: 12px; display: inline-block;">
              <img src="${qrCodeUrl}" alt="QR Code Promozione" style="width: 200px; height: 200px; display: block;" />
            </div>
          </div>
          
          <div style="background: #CC9900; color: #000000; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong>📱 Mostra questo QR Code per usufruire della promozione</strong>
          </div>
          
          <p style="color: #888888; font-size: 14px; margin-bottom: 0;">
            <strong>Validità:</strong> ${validUntilText}<br>
            <strong>Come usarlo:</strong> Mostra il QR Code al momento del pagamento o dell'ordine.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
          <p>TapReview - Gestione Recensioni NFC</p>
          <p>Grazie per essere parte della nostra community!</p>
        </div>
      </div>
    `;

    const text = `
      TapReview - ${promotionDetails.title}
      
      Ciao ${username}!
      
      ${promotionDetails.description}
      
      Il tuo QR Code per la promozione è disponibile al link:
      ${qrCodeUrl}
      
      Validità: ${validUntilText}
      
      Mostra il QR Code al momento del pagamento o dell'ordine per usufruire della promozione.
      
      Grazie per essere parte della nostra community!
      TapReview - Gestione Recensioni NFC
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /**
   * Invia email di benvenuto per nuovo utente creato da admin
   */
  static async sendWelcomeEmail(email: string, username: string, tempPassword: string): Promise<boolean> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/login`;
    
    const subject = 'Benvenuto in TapReview - Account Attivato';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #CC9900, #FFD700); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-size: 24px; font-weight: bold;">TR</span>
          </div>
          <h1 style="color: #CC9900; margin: 0; font-size: 28px;">TapReview</h1>
        </div>
        
        <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #CC9900;">
          <h2 style="color: #CC9900; margin-top: 0;">🎉 Benvenuto in TapReview!</h2>
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 20px;">
            Ciao <strong style="color: #CC9900;">${username}</strong>!
          </p>
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 25px;">
            Il tuo account TapReview è stato attivato con successo. Ecco le tue credenziali di accesso:
          </p>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #CC9900;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0 0 0; color: #CC9900;"><strong>Password temporanea:</strong> <code style="background: #000; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          
          <div style="background: #CC9900; color: #000000; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong>⚠️ Dovrai cambiare la password al primo accesso per motivi di sicurezza</strong>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background-color: #CC9900; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Accedi al tuo Account
            </a>
          </div>
          
          <p style="color: #888888; font-size: 14px; margin-bottom: 0;">
            Conserva questa email fino al primo accesso.<br>
            Per supporto, contatta: tapreviewofficial@gmail.com
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666666; font-size: 14px;">
          <p>TapReview - Gestione Recensioni NFC</p>
          <p>Email automatica, non rispondere.</p>
        </div>
      </div>
    `;

    const text = `
      TapReview - Benvenuto!
      
      Ciao ${username}!
      
      Il tuo account TapReview è stato attivato con successo.
      
      Credenziali di accesso:
      Email: ${email}
      Password temporanea: ${tempPassword}
      
      IMPORTANTE: Dovrai cambiare la password al primo accesso per motivi di sicurezza.
      
      Accedi al tuo account: ${loginUrl}
      
      Conserva questa email fino al primo accesso.
      Per supporto, contatta: tapreviewofficial@gmail.com
      
      TapReview - Gestione Recensioni NFC
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }
}