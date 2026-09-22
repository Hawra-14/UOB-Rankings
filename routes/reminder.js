const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware: admin only
function adminOnly(req, res, next) {
    const jwt = require('jsonwebtoken');
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// 1. GET Needs Attention Metrics (Optimized for Turso)
router.get('/needs-attention', adminOnly, async (req, res) => {
    try {
        // Using SUM instead of COUNT(CASE) and filtering pending in WHERE for SQLite compatibility
        const query = `
            SELECT 
                d.id AS department_id,
                d.name AS department_name,
                SUM(CASE WHEN date(rc.deadline) < date('now') THEN 1 ELSE 0 END) AS overdue_count,
                SUM(CASE WHEN date(rc.deadline) >= date('now') THEN 1 ELSE 0 END) AS pending_count,
                CAST(ROUND(julianday(MIN(rc.deadline)) - julianday('now')) AS INTEGER) AS days_left
            FROM departments d
            JOIN task_assignments ta ON ta.department_id = d.id
            JOIN questions q ON q.id = ta.question_id
            JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
            WHERE rc.status = 'active' 
              AND rc.deadline IS NOT NULL 
              AND ta.status = 'pending'
            GROUP BY d.id, d.name
            ORDER BY overdue_count DESC, pending_count DESC
        `;
        
        const result = await db.execute({ sql: query, args: [] });
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching needs attention:", err);
        res.status(500).json({ error: "Failed to fetch data", details: err.message });
    }
});

// 2. GET Reminder History (Grouped safely in JS)
router.get('/history', adminOnly, async (req, res) => {
    try {
        const result = await db.execute({ 
            sql: `SELECT sent_at, reminder_type, department_id FROM reminder_history ORDER BY sent_at DESC LIMIT 100`, 
            args: [] 
        });
        
        // Group by date + type in JS to avoid SQLite DATE() formatting issues
        const grouped = {};
        for (const row of result.rows) {
            const dateObj = new Date(row.sent_at);
            // Fallback if Turso returns a weird date string
            const dateStr = isNaN(dateObj) ? String(row.sent_at).split(' ')[0] : dateObj.toISOString().split('T')[0];
            const key = `${dateStr}_${row.reminder_type}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    sent_at: row.sent_at,
                    reminder_type: row.reminder_type,
                    recipients_count: 0
                };
            }
            grouped[key].recipients_count++;
        }
        
        res.json(Object.values(grouped));
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// 3. POST Log a Sent Reminder
router.post('/log', adminOnly, async (req, res) => {
    const { ranking_cycle_id, department_ids, reminder_type, message_sent } = req.body;
    
    try {
        if (!Array.isArray(department_ids) || department_ids.length === 0) {
            return res.status(400).json({ error: 'department_ids must be a non-empty array' });
        }

        // Enforce cycle ID because the DB schema has it as NOT NULL
        if (!ranking_cycle_id) {
            return res.status(400).json({ error: 'ranking_cycle_id is required.' });
        }

        for (const dept_id of department_ids) {
            await db.execute({
                sql: `INSERT INTO reminder_history (ranking_cycle_id, department_id, reminder_type, message_sent) 
                      VALUES (?, ?, ?, ?)`,
                args: [ranking_cycle_id, dept_id, reminder_type, message_sent || '']
            });
        }
        
        res.json({ success: true, message: 'Reminder logged successfully' });
    } catch (err) {
        console.error('Database log error:', err);
        res.status(500).json({ error: 'Failed to log reminder', details: err.message });
    }
});

module.exports = router;