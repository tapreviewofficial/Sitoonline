import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../lib/shared/storage.js';
import { comparePassword, signToken, createAuthCookie, createLogoutCookie, getCurrentUser, hashPassword } from '../lib/shared/auth.js';
import { nanoid } from 'nanoid';
import { sendEmail, generatePasswordResetEmail } from '../lib/shared/emailService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api/auth', '');
  
  // /api/auth/login
  if (pathname === '/login' && req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await comparePassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });

      res.setHeader('Set-Cookie', createAuthCookie(token));
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username, 
          mustChangePassword: user.mustChangePassword 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: 'Login failed' });
    }
    return;
  }

  // /api/auth/logout
  if (pathname === '/logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', createLogoutCookie());
    res.json({ message: 'Logged out' });
    return;
  }

  // /api/auth/register
  if (pathname === '/register' && req.method === 'POST') {
    res.status(403).json({ 
      message: "La registrazione pubblica è stata disabilitata. Per attivare un account, contatta tapreviewofficial@gmail.com",
      contactEmail: "tapreviewofficial@gmail.com",
      code: "REGISTRATION_DISABLED"
    });
    return;
  }

  // /api/auth/change-password
  if (pathname === '/change-password' && req.method === 'POST') {
    try {
      const user = await getCurrentUser(req.headers.cookie);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }

      const dbUser = await storage.getUserById(user.userId);
      if (!dbUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isValid = await comparePassword(currentPassword, dbUser.password_hash);
      if (!isValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.userId, hashedNewPassword);

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
    return;
  }

  // /api/auth/request-reset
  if (pathname === '/request-reset' && req.method === 'POST') {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email richiesta' });
      }

      const user = await storage.getUserByEmail(email.toLowerCase());

      if (!user) {
        return res.json({ success: true, message: 'Se l\'email esiste, riceverai le istruzioni per il reset' });
      }

      await storage.invalidateUserPasswordResets(user.id);

      const token = nanoid(32);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await storage.createPasswordReset({
        userId: user.id,
        token,
        expiresAt,
        used: false
      });

      const frontendUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.FRONTEND_URL || 'http://localhost:5000';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;
      
      const emailContent = generatePasswordResetEmail(resetLink, user.username);
      
      await sendEmail({
        to: user.email,
        subject: 'TapReview - Reimpostazione Password',
        html: emailContent.html,
        text: emailContent.text
      });

      res.json({ 
        success: true, 
        message: 'Se l\'email esiste, riceverai le istruzioni per il reset' 
      });

    } catch (error) {
      console.error('Errore richiesta reset password:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
    return;
  }

  // /api/auth/reset-password
  if (pathname === '/reset-password' && req.method === 'POST') {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token e nuova password richiesti' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La password deve essere almeno di 6 caratteri' });
      }

      const passwordReset = await storage.getPasswordResetByToken(token);

      if (!passwordReset || passwordReset.used || passwordReset.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Token non valido o scaduto' });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(passwordReset.userId, hashedPassword);
      await storage.markPasswordResetAsUsed(passwordReset.id);

      res.json({ success: true, message: 'Password reimpostata con successo' });

    } catch (error) {
      console.error('Errore reset password:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
    return;
  }

  // /api/auth/verify-reset/:token
  if (pathname.startsWith('/verify-reset/') && req.method === 'GET') {
    try {
      const token = pathname.replace('/verify-reset/', '');

      if (!token) {
        return res.status(400).json({ error: 'Token richiesto' });
      }

      const passwordReset = await storage.getPasswordResetByToken(token);

      if (!passwordReset || passwordReset.used || passwordReset.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Token non valido o scaduto' });
      }

      res.json({ 
        valid: true, 
        username: passwordReset.user.username 
      });

    } catch (error) {
      console.error('Errore verifica token reset:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
    return;
  }

  // Route non trovata
  res.status(404).json({ message: 'Not found' });
}
