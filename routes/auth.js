const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// LOGIN
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

    // Save token to user_credentials
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

// GET current user (verify token)
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

// LOGOUT
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