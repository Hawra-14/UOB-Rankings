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

// GET dashboard stats
router.get('/dashboard', adminOnly, async (req, res) => {
    try {
        const stats = await db.execute({
            sql: `SELECT
              COUNT(*) as total,
              COUNT(CASE WHEN status != 'pending' THEN 1 END) as submitted,
              COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
            FROM task_assignments`,
            args: []
        });

        const depts = await db.execute({
            sql: `SELECT
              d.name,
              COUNT(ta.id) as total,
              COUNT(CASE WHEN ta.status != 'pending' THEN 1 END) as submitted
            FROM departments d
            LEFT JOIN task_assignments ta ON ta.department_id = d.id
            GROUP BY d.id, d.name
            HAVING COUNT(ta.id) > 0
            ORDER BY d.name`,
            args: []
        });

        res.json({
            total: stats.rows[0]?.total || 0,
            submitted: stats.rows[0]?.submitted || 0,
            pending: stats.rows[0]?.pending || 0,
            overdue: 0,
            departments: depts.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all ranking cycles
router.get('/cycles', adminOnly, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT rc.*,
              COUNT(q.id) as total_questions,
              COUNT(ta.id) as assigned_questions,
              COUNT(CASE WHEN ta.status != 'pending' THEN 1 END) as submitted_questions
            FROM ranking_cycles rc
            LEFT JOIN questions q ON q.ranking_cycle_id = rc.id
            LEFT JOIN task_assignments ta ON ta.question_id = q.id
            GROUP BY rc.id
            ORDER BY rc.year DESC, rc.id DESC`,
            args: []
        });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST create new ranking cycle
router.post('/cycles', adminOnly, async (req, res) => {
    const { name, year, deadline, status, description } = req.body;
    try {
        // Create the cycle
        const result = await db.execute({
            sql: `INSERT INTO ranking_cycles (name, year, deadline, start_date, status, description)
            VALUES (?, ?, ?, ?, ?, ?)`,
            args: [name, year, deadline, req.body.start_date || null, status || 'active', description || null]
        });
        const newCycleId = Number(result.lastInsertRowid);

        // Strip year from name to get the ranking type
        // e.g. "QS Sustainability Rankings 2026" → "QS Sustainability Rankings"
        const rankingType = name.replace(/\s+\d{4}$/, '').trim().toLowerCase();

        // Find the oldest existing cycle of the same ranking type to use as a template
        const allCycles = await db.execute({
            sql: `SELECT id, name FROM ranking_cycles WHERE id != ? ORDER BY year ASC`,
            args: [newCycleId]
        });

        const templateCycle = allCycles.rows.find(c => {
            const storedType = c.name.replace(/\s+\d{4}$/, '').trim().toLowerCase();
            return storedType === rankingType;
        });

        if (templateCycle) {
            // Copy all questions from the template cycle to the new one
            // kpi_index is included for THE WUR subject-based questions
            await db.execute({
                sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, kpi_index)
                      SELECT ?, code, title, description, question_type, theme, kpi_index
                      FROM questions WHERE ranking_cycle_id = ?`,
                args: [newCycleId, templateCycle.id]
            });
            console.log(`✓ Copied questions from cycle ${templateCycle.id} ("${templateCycle.name}") → new cycle ${newCycleId}`);
        } else {
            console.log(`⚠ No template found for "${rankingType}" — seed questions manually for cycle ${newCycleId}`);
        }

        res.json({ success: true, id: newCycleId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all questions for a ranking cycle (admin view with assignments)
router.get('/cycles/:id/questions', adminOnly, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT q.*,
              ta.id as task_id,
              ta.department_id,
              ta.status as task_status,
              ta.submitted_at,
              d.name as department_name,
              a.answer_text,
              a.answer_number,
              a.updated_at as answer_updated_at
            FROM questions q
            LEFT JOIN task_assignments ta ON ta.question_id = q.id
            LEFT JOIN departments d ON d.id = ta.department_id
            LEFT JOIN answers a ON a.task_assignment_id = ta.id
            WHERE q.ranking_cycle_id = ?
            ORDER BY q.id`,
            args: [req.params.id]
        });

        // Attach items to each question
        const questions = [];
        for (const q of result.rows) {
            const items = await db.execute({
                sql: `SELECT * FROM question_items WHERE question_id = ? ORDER BY CAST(item_number AS INTEGER)`,
                args: [q.id]
            });
            questions.push({ ...q, items: items.rows });
        }

        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST assign a question to a department
router.post('/assign', adminOnly, async (req, res) => {
    const { question_id, department_id } = req.body;
    try {
        // Assign the selected question
        await db.execute({
            sql: `INSERT INTO task_assignments (question_id, department_id, status)
            VALUES (?, ?, 'pending')
            ON CONFLICT(question_id) DO UPDATE SET
            department_id = excluded.department_id`,
            args: [question_id, department_id]
        });

        // Check if this question has a kpi_index (THE WUR question)
        const qInfo = await db.execute({
            sql: `SELECT kpi_index, ranking_cycle_id FROM questions WHERE id = ?`,
            args: [question_id]
        });
        const q = qInfo.rows[0];

        if (q?.kpi_index) {
            // Find all other questions with the same kpi_index in the same cycle
            const siblings = await db.execute({
                sql: `SELECT id FROM questions 
                      WHERE ranking_cycle_id = ? AND kpi_index = ? AND id != ?`,
                args: [q.ranking_cycle_id, q.kpi_index, question_id]
            });

            // Assign all sibling questions to the same department
            for (const sibling of siblings.rows) {
                await db.execute({
                    sql: `INSERT INTO task_assignments (question_id, department_id, status)
                          VALUES (?, ?, 'pending')
                          ON CONFLICT(question_id) DO UPDATE SET
                          department_id = excluded.department_id`,
                    args: [sibling.id, department_id]
                });
            }

            console.log(`✓ Synced kpi_index ${q.kpi_index} across ${siblings.rows.length} other subjects → dept ${department_id}`);
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all departments
router.get('/departments', adminOnly, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT d.*,
              COUNT(ta.id) as assigned_tasks,
              COUNT(CASE WHEN ta.status != 'pending' THEN 1 END) as submitted_tasks
            FROM departments d
            LEFT JOIN task_assignments ta ON ta.department_id = d.id
            GROUP BY d.id
            ORDER BY d.name`,
            args: []
        });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET progress for all departments in a ranking cycle
router.get('/progress/:ranking_cycle_id', adminOnly, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT
              d.id, d.name,
              COUNT(ta.id) as assigned,
              COUNT(CASE WHEN ta.status != 'pending' THEN 1 END) as submitted,
              COUNT(CASE WHEN ta.status = 'pending' THEN 1 END) as pending
            FROM departments d
            LEFT JOIN task_assignments ta ON ta.department_id = d.id
            LEFT JOIN questions q ON q.id = ta.question_id AND q.ranking_cycle_id = ?
            WHERE ta.id IS NOT NULL
            GROUP BY d.id, d.name
            ORDER BY d.name`,
            args: [req.params.ranking_cycle_id]
        });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH close a ranking cycle
router.patch('/cycles/:id/close', adminOnly, async (req, res) => {
    try {
        await db.execute({
            sql: `UPDATE ranking_cycles SET status = 'closed' WHERE id = ?`,
            args: [req.params.id]
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;