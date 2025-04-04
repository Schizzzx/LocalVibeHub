const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');


function adminOnly(req, res, next) {
  if (req.user.role !== 1) {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
}


router.post('/', authMiddleware, async (req, res) => {
  const { report_type, target_id, reason } = req.body;
  const user_id = req.user.id;

  if (!report_type || !target_id || !reason) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!['event', 'comment'].includes(report_type)) {
    return res.status(400).json({ error: 'Invalid report type.' });
  }

  try {
    await pool.promise().query(
      `INSERT INTO reports (type, target_id, reason, reporter_id) VALUES (?, ?, ?, ?)`,
      [report_type, target_id, reason, user_id]
    );

    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (err) {
    console.error('[REPORT] error:', err);
    res.status(500).json({ error: 'Failed to submit report.' });
  }
});


router.get('/comments', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT r.target_id, COUNT(*) AS report_count, c.comment, c.created_at,
              u.username AS author, u.id AS author_id
       FROM reports r
       JOIN comments c ON r.target_id = c.id
       JOIN users u ON c.user_id = u.id
       WHERE r.type = 'comment'
       GROUP BY r.target_id
       ORDER BY report_count DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('[REPORT] fetch comments error:', err);
    res.status(500).json({ error: 'Failed to fetch reported comments.' });
  }
});


router.get('/events', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT r.target_id, COUNT(*) AS report_count, e.title, e.date, e.created_at,
              u.username AS organizer, u.id AS organizer_id
       FROM reports r
       JOIN events e ON r.target_id = e.id
       JOIN users u ON e.organizer_id = u.id
       WHERE r.type = 'event'
       GROUP BY r.target_id
       ORDER BY report_count DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('[REPORT] fetch events error:', err);
    res.status(500).json({ error: 'Failed to fetch reported events.' });
  }
});

module.exports = router;
