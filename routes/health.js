const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.execute({ sql: "SELECT 1 as ok", args: [] });
    res.json({ 
      status: 'ok', 
      db: 'connected', 
      time: new Date().toISOString() 
    });
  } catch (err) {
    console.error('DB health check failed:', err);
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

module.exports = router;