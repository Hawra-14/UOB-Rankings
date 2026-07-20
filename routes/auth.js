const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const db = require('../db');
const emailjs = require('@emailjs/nodejs'); 

// Initialize EmailJS securely on the backend
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

// ==========================================
// 1. REQUEST PASSWORD RESET (With Debug Logs)
// ==========================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  console.log('\n--- 🔍 DEBUG FORGOT PASSWORD REQUEST ---');
  console.log('1. Email requested:', email);
  console.log('2. Service ID loaded:', process.env.EMAILJS_SERVICE_ID ? '✅ Yes' : '❌ MISSING in .env');
  console.log('3. Template ID loaded:', process.env.EMAILJS_TEMPLATE_ID ? '✅ Yes' : '❌ MISSING in .env');

  try {
    // Check if user exists
    const result = await db.execute({
      sql: 'SELECT id, name, email FROM users WHERE email = ?',
      args: [email]
    });

    const user = result.rows[0];
    console.log('4. User found in database:', user ? `✅ Yes (${user.name})` : '❌ NO (Silent fail triggered for security)');

    // SECURITY: Always return the same message to prevent email enumeration attacks
    const successMessage = 'If this email is registered, a reset code has been sent.';

    if (!user) {
      console.log('➡️ Ending request: User not found (silent fail).');
      return res.json({ message: successMessage });
    }

    // Generate secure 6-digit OTP and 64-character random token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    console.log('5. Generated OTP:', otp);
    console.log('6. Generated Token:', resetToken.substring(0, 10) + '...');

    // Save to database (expires in 15 minutes)
    await db.execute({
      sql: `UPDATE users 
            SET reset_otp = ?, 
                reset_token = ?, 
                reset_expires_at = datetime('now', '+15 minutes') 
            WHERE id = ?`,
      args: [otp, resetToken, user.id]
    });
    console.log('7. ✅ Database updated with reset credentials.');

    // Construct the reset link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    const resetLink = `${baseUrl}/reset-password.html?token=${resetToken}`;
    console.log('8. Reset Link generated:', resetLink);

    // Send email via EmailJS
    try {
      console.log('9. Attempting to send email via EmailJS...');
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: user.email,
          to_name: user.name,
          otp_code: otp,
          reset_link: resetLink,
          expiry_minutes: 15
        }
      );
      console.log('10. ✅✅✅ EmailJS reports SUCCESS! Email sent to:', user.email);
    } catch (emailErr) {
      console.error('❌❌❌ EmailJS FAILED:', emailErr);
    }

    console.log('-----------------------------------------\n');
    res.json({ message: successMessage });

  } catch (err) {
    console.error('❌ Forgot Password Database/Server Error:', err);
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
      sql: `SELECT id, reset_otp, reset_expires_at 
            FROM users 
            WHERE reset_token = ? 
            AND datetime('now') < reset_expires_at`,
      args: [token]
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
    }

    if (user.reset_otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check your email.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.execute({
      sql: `UPDATE users 
            SET password_hash = ?, 
                reset_otp = NULL, 
                reset_token = NULL, 
                reset_expires_at = NULL 
            WHERE id = ?`,
      args: [hashedPassword, user.id]
    });

    res.json({ message: 'Password successfully reset. You can now sign in.' });

  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// EXISTING ROUTES (Login, Me, Logout)
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

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
      sql: `INSERT INTO user_credentials (user_id, token, last_login)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(user_id) DO UPDATE SET
            token = excluded.token,
            last_login = datetime('now')`,
      args: [user.id, token]
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department_id: user.department_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.execute({
      sql: `SELECT u.id, u.name, u.email, u.role, u.department_id, d.name as department_name
            FROM users u
            LEFT JOIN departments d ON d.id = u.department_id
            WHERE u.id = ?`,
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
    await db.execute({
      sql: `UPDATE user_credentials SET token = NULL WHERE user_id = ?`,
      args: [decoded.id]
    });
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;