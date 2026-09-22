const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const db = require('../db');
const emailjs = require('@emailjs/nodejs'); 
const { logActivity } = require('../src/utils/activityLogger'); 


emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

// ==========================================
// 1. REQUEST PASSWORD RESET
// ==========================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await db.execute({
      sql: 'SELECT id, name, email FROM users WHERE email = ?',
      args: [email]
    });
    const user = result.rows[0];
    const successMessage = 'If this email is registered, a reset code has been sent.';

    if (!user) return res.json({ message: successMessage });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');

    await db.execute({
      sql: `UPDATE users SET reset_otp = ?, reset_token = ?, reset_expires_at = datetime('now', '+15 minutes') WHERE id = ?`,
      args: [otp, resetToken, user.id]
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    const resetLink = `${baseUrl}/reset-password.html?token=${resetToken}`;

    try {
      await emailjs.send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, {
        to_email: user.email, to_name: user.name, otp_code: otp, reset_link: resetLink, expiry_minutes: 15
      });
    } catch (emailErr) {
      console.error('❌ EmailJS FAILED:', emailErr);
    }

    res.json({ message: successMessage });
  } catch (err) {
    console.error('❌ Forgot Password Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// 2. VERIFY OTP & RESET PASSWORD
// ==========================================
router.post('/reset-password', async (req, res) => {
  const { token, otp, newPassword } = req.body;
  try {
    const result = await db.execute({
      sql: `SELECT id, reset_otp, reset_expires_at FROM users WHERE reset_token = ? AND datetime('now') < reset_expires_at`,
      args: [token]
    });
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link.' });
    if (user.reset_otp !== otp) return res.status(400).json({ error: 'Invalid OTP code.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute({
      sql: `UPDATE users SET password_hash = ?, reset_otp = NULL, reset_token = NULL, reset_expires_at = NULL WHERE id = ?`,
      args: [hashedPassword, user.id]
    });

    res.json({ message: 'Password successfully reset. You can now sign in.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// 3. LOGIN (✅ FIXED: logActivity is now BEFORE res.json)
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role: user.role, department_id: user.department_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await db.execute({
      sql: `INSERT INTO user_credentials (user_id, token, last_login) VALUES (?, ?, datetime('now')) ON CONFLICT(user_id) DO UPDATE SET token = excluded.token, last_login = datetime('now')`,
      args: [user.id, token]
    });

    // LOG ACTIVITY *BEFORE* SENDING RESPONSE
    await logActivity({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
      entityName: user.name,
      ip: req.ip
    });


    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, department_id: user.department_id }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// 4. ME & LOGOUT
// ==========================================
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.execute({
      sql: `SELECT u.id, u.name, u.email, u.role, u.department_id, d.name as department_name FROM users u LEFT JOIN departments d ON d.id = u.department_id WHERE u.id = ?`,
      args: [decoded.id]
    });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Log logout activity
    await logActivity({ userId: decoded.id, action: 'LOGOUT', entityType: 'user', entityId: decoded.id, ip: req.ip });

    await db.execute({ sql: `UPDATE user_credentials SET token = NULL WHERE user_id = ?`, args: [decoded.id] });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;