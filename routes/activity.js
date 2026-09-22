const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET recent activity (for dashboard - last 5 logs)
router.get('/recent', verifyAdmin, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5`,
      args: []
    });
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent activity:', err);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// GET all activity logs (for the full activity-log.html page)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await db.execute({
      sql: `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [limit, offset]
    });
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

module.exports = router;