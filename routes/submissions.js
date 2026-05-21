const express = require('express');
const router = express.Router();
const db = require('../db');

// GET progress for a department in a ranking
router.get('/progress/:department_id/:ranking_cycle_id', async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT
              COUNT(ta.id) as total,
              COUNT(CASE WHEN ta.status != 'pending' THEN 1 END) as submitted
            FROM task_assignments ta
            JOIN questions q ON q.id = ta.question_id
            WHERE ta.department_id = ?
            AND q.ranking_cycle_id = ?`,
      args: [req.params.department_id, req.params.ranking_cycle_id]
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST submit an answer
router.post('/submit', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.split(' ')[1];
  let submittedBy = req.body.user_id || null;
  let submitterName = 'Unknown';

  // Get submitter name for history
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRes = await db.execute({
        sql: 'SELECT name FROM users WHERE id = ?',
        args: [decoded.id]
      });
      if (userRes.rows[0]) submitterName = userRes.rows[0].name;
      submittedBy = decoded.id;
    } catch (e) { }
  }

  const { task_assignment_id, answers } = req.body;

  try {
    const cycleCheck = await db.execute({
      sql: `SELECT rc.status FROM ranking_cycles rc
              JOIN questions q ON q.ranking_cycle_id = rc.id
              JOIN task_assignments ta ON ta.question_id = q.id
              WHERE ta.id = ?`,
      args: [task_assignment_id]
    });
    if (cycleCheck.rows[0]?.status === 'closed') {
      return res.status(403).json({ error: 'This ranking form has been closed and no longer accepts submissions.' });
    }
  } catch (e) { }

  try {
    const existing = await db.execute({
      sql: `SELECT id FROM answers WHERE task_assignment_id = ?`,
      args: [task_assignment_id]
    });

    if (existing.rows.length > 0) {
      const answer_id = existing.rows[0].id;

      // Update the answer first
      await db.execute({
        sql: `UPDATE answers SET
              answer_text = ?,
              answer_number = ?,
              updated_at = datetime('now')
              WHERE task_assignment_id = ?`,
        args: [
          answers.answer_text || null,
          answers.answer_number || null,
          task_assignment_id
        ]
      });

      // Now save the NEW value to history, attributed to the current submitter
      await db.execute({
        sql: `INSERT INTO answer_history
              (answer_id, task_assignment_id, answer_text, answer_number, changed_by)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          answer_id,
          task_assignment_id,
          answers.answer_text || null,
          answers.answer_number || null,
          submittedBy
        ]
      });
    } else {
      // Insert new answer
      const inserted = await db.execute({
        sql: `INSERT INTO answers (task_assignment_id, answer_text, answer_number)
              VALUES (?, ?, ?)
              RETURNING id`,
        args: [
          task_assignment_id,
          answers.answer_text || null,
          answers.answer_number || null
        ]
      });

      const newAnswerId = inserted.rows[0]?.id;

      // Write first history entry so the submitter is recorded from the start
      if (newAnswerId) {
        await db.execute({
          sql: `INSERT INTO answer_history
                (answer_id, task_assignment_id, answer_text, answer_number, changed_by)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            newAnswerId,
            task_assignment_id,
            answers.answer_text || null,
            answers.answer_number || null,
            submittedBy
          ]
        });
      }
    }

    // Sync answers across forms if question is synced
    try {
      const taskQuestion = await db.execute({
        sql: `SELECT q.code, q.title, q.is_synced 
          FROM task_assignments ta 
          JOIN questions q ON q.id = ta.question_id 
          WHERE ta.id = ?`,
        args: [task_assignment_id]
      });
      const question = taskQuestion.rows[0];

      if (question?.is_synced) {
        const otherTasks = await db.execute({
          sql: `SELECT ta.id 
                FROM task_assignments ta
                JOIN questions q ON q.id = ta.question_id
                JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                JOIN ranking_cycles rc_src ON rc_src.id = (
                  SELECT q2.ranking_cycle_id FROM task_assignments ta2
                  JOIN questions q2 ON q2.id = ta2.question_id
                  WHERE ta2.id = ?
                )
                WHERE q.title = ? 
                AND q.is_synced = 1
                AND ta.id != ?
                AND rc.year = rc_src.year`,
          args: [task_assignment_id, question.title, task_assignment_id]
        });

        for (const task of otherTasks.rows) {
          const existingSync = await db.execute({
            sql: `SELECT id FROM answers WHERE task_assignment_id = ?`,
            args: [task.id]
          });

          if (existingSync.rows.length > 0) {
            const syncAnswerId = existingSync.rows[0].id;
            await db.execute({
              sql: `UPDATE answers SET answer_text = ?, answer_number = ?, updated_at = datetime('now')
                    WHERE task_assignment_id = ?`,
              args: [answers.answer_text || null, answers.answer_number || null, task.id]
            });
            await db.execute({
              sql: `INSERT INTO answer_history (answer_id, task_assignment_id, answer_text, answer_number, changed_by)
                    VALUES (?, ?, ?, ?, ?)`,
              args: [syncAnswerId, task.id, answers.answer_text || null, answers.answer_number || null, submittedBy]
            });
          } else {
            const syncInserted = await db.execute({
              sql: `INSERT INTO answers (task_assignment_id, answer_text, answer_number)
                    VALUES (?, ?, ?) RETURNING id`,
              args: [task.id, answers.answer_text || null, answers.answer_number || null]
            });
            const syncAnswerId = syncInserted.rows[0]?.id;
            if (syncAnswerId) {
              await db.execute({
                sql: `INSERT INTO answer_history (answer_id, task_assignment_id, answer_text, answer_number, changed_by)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [syncAnswerId, task.id, answers.answer_text || null, answers.answer_number || null, submittedBy]
              });
            }
          }

          await db.execute({
            sql: `UPDATE task_assignments SET status = 'submitted', submitted_at = datetime('now') WHERE id = ?`,
            args: [task.id]
          });

          await db.execute({
            sql: `UPDATE answers SET status = 'submitted' WHERE task_assignment_id = ?`,
            args: [task.id]
          });
        }
      }
    } catch (syncErr) {
      console.error('Sync error:', syncErr);
    }

    // Update task status
    await db.execute({
      sql: `UPDATE task_assignments SET
            status = 'submitted',
            submitted_at = datetime('now')
            WHERE id = ?`,
      args: [task_assignment_id]
    });

    // Update answer status to submitted
    await db.execute({
      sql: `UPDATE answers SET status = 'submitted' WHERE task_assignment_id = ?`,
      args: [task_assignment_id]
    });

    res.json({ success: true, submitted_by: submitterName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history-all/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const taskRes = await db.execute({
      sql: `SELECT q.title, rc.name as cycle_name
                  FROM task_assignments ta 
                  JOIN questions q ON q.id = ta.question_id
                  JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                  WHERE ta.id = ?`,
      args: [taskId]
    });
    if (!taskRes.rows.length) return res.json([]);
    const { title, cycle_name } = taskRes.rows[0];
    const rankingType = cycle_name.replace(/\s+\d{4}$/, '').trim();

    const result = await db.execute({
      sql: `SELECT 
                    ah.answer_text, ah.answer_number, ah.changed_at,
                    u.name as changed_by_name,
                    rc.year
                  FROM answer_history ah
                  LEFT JOIN users u ON u.id = ah.changed_by
                  JOIN task_assignments ta ON ta.id = ah.task_assignment_id
                  JOIN questions q ON q.id = ta.question_id
                  JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                  WHERE q.title = ?
                  AND rc.name LIKE ?
                  ORDER BY rc.year DESC, ah.changed_at DESC`,
      args: [title, `${rankingType}%`]
    });
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/history-by-question/:questionId', async (req, res) => {
  const { questionId } = req.params;
  try {
    const taskRes = await db.execute({
      sql: `SELECT q.title, rc.name as cycle_name
                  FROM questions q
                  JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                  WHERE q.id = ?`,
      args: [questionId]
    });
    if (!taskRes.rows.length) return res.json([]);
    const { title, cycle_name } = taskRes.rows[0];
    const rankingType = cycle_name.replace(/\s+\d{4}$/, '').trim();

    const result = await db.execute({
      sql: `SELECT 
                    ah.answer_text, ah.answer_number, ah.changed_at,
                    u.name as changed_by_name,
                    rc.year
                  FROM answer_history ah
                  LEFT JOIN users u ON u.id = ah.changed_by
                  JOIN task_assignments ta ON ta.id = ah.task_assignment_id
                  JOIN questions q ON q.id = ta.question_id
                  JOIN ranking_cycles rc ON rc.id = q.ranking_cycle_id
                  WHERE q.title = ?
                  AND rc.name LIKE ?
                  ORDER BY rc.year DESC, ah.changed_at DESC`,
      args: [title, `${rankingType}%`]
    });
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// GET answer history for a task assignment
router.get('/history/:task_assignment_id', async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT ah.*, u.name as changed_by_name
            FROM answer_history ah
            LEFT JOIN users u ON u.id = ah.changed_by
            WHERE ah.task_assignment_id = ?
            ORDER BY ah.changed_at DESC`,
      args: [req.params.task_assignment_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all submissions for admin view
router.get('/admin/:ranking_cycle_id', async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT
              q.code, q.title, q.description,
              d.name as department_name,
              ta.status, ta.submitted_at,
              a.answer_text, a.answer_number, a.updated_at
            FROM task_assignments ta
            JOIN questions q ON q.id = ta.question_id
            JOIN departments d ON d.id = ta.department_id
            LEFT JOIN answers a ON a.task_assignment_id = ta.id
            WHERE q.ranking_cycle_id = ?
            ORDER BY q.id`,
      args: [req.params.ranking_cycle_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;