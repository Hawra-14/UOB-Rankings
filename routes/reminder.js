const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db.js is in the root

// Route to log a reminder in the database
router.post('/log', async (req, res) => {
    const { ranking_cycle_id, department_id, reminder_type, message } = req.body;
    
    try {
        await db.execute({
            sql: `INSERT INTO reminder_history (ranking_cycle_id, department_id, reminder_type, message_sent) 
                  VALUES (?, ?, ?, ?)`,
            args: [ranking_cycle_id || null, department_id || null, reminder_type, message]
        });
        res.json({ success: true, message: 'Reminder logged successfully' });
    } catch (err) {
        console.error('Database log error:', err);
        res.status(500).json({ error: 'Failed to log reminder' });
    }
});

module.exports = router;