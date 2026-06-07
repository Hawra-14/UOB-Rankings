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
                WHERE rc.is_template = 0 OR rc.is_template IS NULL
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

router.get('/cycles/:id', adminOnly, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT * FROM ranking_cycles WHERE id = ?`,
            args: [req.params.id]
        });
        if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
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

        const allCycles = await db.execute({
            sql: `SELECT id, name, is_template FROM ranking_cycles WHERE id != ? ORDER BY year ASC`,
            args: [newCycleId]
        });

        function getRankingCategory(name) {
            const n = name.toLowerCase();
            if (n.includes('greenmetric')) return 'greenmetric';
            if (n.includes('sustainability')) return 'sustainability';
            if (n.includes('impact')) return 'impact';
            if (n.includes('world university') || n.includes('wur')) {
                if (n.includes('qs')) return 'qs-wur';
                return 'the-wur';
            }
            return n;
        }

        const newCategory = getRankingCategory(name);
        const templateCycle = allCycles.rows.find(c => {
            return getRankingCategory(c.name) === newCategory && c.is_template === 1;
        });

        if (templateCycle) {
            // Copy all questions from the template cycle to the new one
            // kpi_index is included for THE WUR subject-based questions
            await db.execute({
                sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, kpi_index, is_synced, gm_category, has_evidence)
                    SELECT ?, code, title, description, question_type, theme, kpi_index, is_synced, gm_category, has_evidence
                    FROM questions WHERE ranking_cycle_id = ?`,
                args: [newCycleId, templateCycle.id]
            });

            await db.execute({
                sql: `INSERT INTO question_items (question_id, item_number, label, answer_type, max_words, options)
                    SELECT q_new.id, qi.item_number, qi.label, qi.answer_type, qi.max_words, qi.options
                    FROM question_items qi
                    JOIN questions q_old ON q_old.id = qi.question_id AND q_old.ranking_cycle_id = ?
                    JOIN questions q_new ON q_new.code = q_old.code AND q_new.ranking_cycle_id = ?`,
                args: [templateCycle.id, newCycleId]
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
            sql: `SELECT q.*, ta.id as task_id, ta.department_id, ta.deadline,
                    d.name as department_name,
                    a.answer_text, a.answer_number, a.updated_at as answer_updated_at,
                    a.status as task_status, a.admin_comment
                FROM questions q
                LEFT JOIN task_assignments ta ON ta.question_id = q.id
                LEFT JOIN departments d ON d.id = ta.department_id
                LEFT JOIN answers a ON a.task_assignment_id = ta.id
                WHERE q.ranking_cycle_id = ?`,
            args: [req.params.id]
        });

        // Fetch ALL items in one query
        const allItems = await db.execute({
            sql: `SELECT qi.* FROM question_items qi
                  JOIN questions q ON q.id = qi.question_id
                  WHERE q.ranking_cycle_id = ?
                  ORDER BY qi.question_id, CAST(qi.item_number AS INTEGER)`,
            args: [req.params.id]
        });

        // Group items by question_id
        const itemsMap = {};
        for (const item of allItems.rows) {
            if (!itemsMap[item.question_id]) itemsMap[item.question_id] = [];
            itemsMap[item.question_id].push(item);
        }

        const questions = result.rows.map(q => ({
            ...q,
            items: itemsMap[q.id] || []
        }));

        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST assign a question to a department
router.post('/assign', adminOnly, async (req, res) => {
    const { question_id, department_id, deadline } = req.body;
    try {
        // Helper: assign one question + insert answer row
        async function assignOne(qid) {
            await db.execute({
                sql: `INSERT INTO task_assignments (question_id, department_id, deadline, status)
                    VALUES (?, ?, ?, 'pending')
                    ON CONFLICT(question_id) DO UPDATE SET
                    department_id = excluded.department_id,
                    deadline = excluded.deadline`,
                args: [qid, department_id, deadline || null]
            });
            const taRes = await db.execute({
                sql: `SELECT id FROM task_assignments WHERE question_id = ?`,
                args: [qid]
            });
            const taId = taRes.rows[0]?.id;
            if (taId) {
                await db.execute({
                    sql: `INSERT INTO answers (task_assignment_id, status)
                  VALUES (?, 'pending')
                  ON CONFLICT(task_assignment_id) DO NOTHING`,
                    args: [taId]
                });
            }
        }

        // Run all lookups in parallel
        const [qInfo, syncInfo] = await Promise.all([
            db.execute({ sql: `SELECT kpi_index, ranking_cycle_id FROM questions WHERE id = ?`, args: [question_id] }),
            db.execute({
                sql: `SELECT q.code, q.title, q.is_synced, rc.year
                      FROM questions q JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                      WHERE q.id = ?`,
                args: [question_id]
            })
        ]);

        const q = qInfo.rows[0];
        const syncQ = syncInfo.rows[0];

        // Find siblings and synced questions in parallel
        const [siblingsRes, matchingRes] = await Promise.all([
            q?.kpi_index
                ? db.execute({
                    sql: `SELECT id FROM questions WHERE ranking_cycle_id = ? AND kpi_index = ? AND id != ?`,
                    args: [q.ranking_cycle_id, q.kpi_index, question_id]
                })
                : Promise.resolve({ rows: [] }),
            syncQ?.is_synced
                ? db.execute({
                    sql: `SELECT q.id FROM questions q
                        JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                        WHERE q.code = ? AND q.is_synced = 1 AND q.id != ? AND rc.year = ?`,
                    args: [syncQ.code, question_id, syncQ.year]
                })
                : Promise.resolve({ rows: [] })
        ]);

        // Assign all questions in parallel
        const allIds = [
            question_id,
            ...siblingsRes.rows.map(r => r.id),
            ...matchingRes.rows.map(r => r.id)
        ];

        await Promise.all(allIds.map(id => assignOne(id)));

        res.json({ success: true, assignedIds: allIds });
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

router.patch('/answers/:taskId/status', async (req, res) => {
    const { taskId } = req.params;
    const { status, comment } = req.body;
    try {
        await db.execute({
            sql: `UPDATE answers SET status = ?, admin_comment = ? WHERE task_assignment_id = ?`,
            args: [status, comment || null, taskId]
        });
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
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