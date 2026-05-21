const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all questions for a ranking cycle with their items and assignment
router.get('/ranking/:ranking_cycle_id', async (req, res) => {
  try {
    const questions = await db.execute({
      sql: `SELECT q.*, ta.department_id, ta.status, ta.id as task_id
            FROM questions q
            LEFT JOIN task_assignments ta ON ta.question_id = q.id
            WHERE q.ranking_cycle_id = ?
            ORDER BY q.id`,
      args: [req.params.ranking_cycle_id]
    });

    const result = [];
    for (const q of questions.rows) {
      const items = await db.execute({
        sql: `SELECT * FROM question_items WHERE question_id = ? ORDER BY item_number`,
        args: [q.id]
      });
      result.push({ ...q, items: items.rows });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET questions assigned to a specific department for a ranking
router.get('/department/:department_id/ranking/:ranking_cycle_id', async (req, res) => {
  try {
    const questions = await db.execute({
      sql: `SELECT q.*, ta.status, ta.id as task_id, ta.submitted_at
            FROM questions q
            JOIN task_assignments ta ON ta.question_id = q.id
            WHERE ta.department_id = ?
            AND q.ranking_cycle_id = ?
            ORDER BY q.id`,
      args: [req.params.department_id, req.params.ranking_cycle_id]
    });

    const result = [];
    for (const q of questions.rows) {
      const items = await db.execute({
        sql: `SELECT * FROM question_items WHERE question_id = ? ORDER BY item_number`,
        args: [q.id]
      });
      const answers = await db.execute({
        sql: `SELECT * FROM answers WHERE task_assignment_id = ?`,
        args: [q.task_id]
      });
      result.push({ ...q, items: items.rows, answers: answers.rows });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all ranking cycles that have questions assigned to a department
router.get('/my-rankings', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const dept_id = decoded.department_id;

    const result = await db.execute({
      sql: `SELECT DISTINCT rc.*,
              COUNT(ta.id) as assigned,
              COUNT(CASE WHEN ta.status != 'pending' THEN 1 END) as submitted
            FROM ranking_cycles rc
            JOIN questions q ON q.ranking_cycle_id = rc.id
            JOIN task_assignments ta ON ta.question_id = q.id
            WHERE ta.department_id = ?
            GROUP BY rc.id
            ORDER BY rc.year DESC`,
      args: [dept_id]
    });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET assigned questions for a department in a ranking cycle — includes items
router.get('/my-questions/:ranking_cycle_id', async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  let dept_id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    dept_id = decoded.department_id;
    if (!dept_id) return res.status(403).json({ error: 'No department' });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const result = await db.execute({
      sql: `SELECT q.*, ta.id as task_id, ta.submitted_at,
                    a.id as answer_id, a.answer_text, a.answer_number,
                    a.updated_at as answer_updated_at,
                    a.status as task_status, a.admin_comment
                FROM questions q
                JOIN task_assignments ta ON ta.question_id = q.id
                LEFT JOIN answers a ON a.task_assignment_id = ta.id
                WHERE ta.department_id = ? AND q.ranking_cycle_id = ?
                ORDER BY q.id`,
      args: [dept_id, req.params.ranking_cycle_id]
    });

    const allItems = await db.execute({
      sql: `SELECT qi.* FROM question_items qi
                  JOIN questions q ON q.id = qi.question_id
                  JOIN task_assignments ta ON ta.question_id = q.id
                  WHERE ta.department_id = ? AND q.ranking_cycle_id = ?
                  ORDER BY qi.question_id, CAST(qi.item_number AS INTEGER)`,
      args: [dept_id, req.params.ranking_cycle_id]
    });

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

module.exports = router;