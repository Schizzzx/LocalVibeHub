const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper');


function adminOnly(req, res, next) {
  if (req.user.role !== 1) {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
}


router.use(authMiddleware, adminOnly);


router.get('/users/reported', async (req, res) => {
  try {
    const [commentReports] = await pool.promise().query(`
      SELECT c.user_id AS userId, u.username, COUNT(*) AS report_count
      FROM reports r
      JOIN comments c ON r.target_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE r.type = 'comment'
      GROUP BY c.user_id
    `);

    const [eventReports] = await pool.promise().query(`
      SELECT e.organizer_id AS userId, u.username, COUNT(*) AS report_count
      FROM reports r
      JOIN events e ON r.target_id = e.id
      JOIN users u ON e.organizer_id = u.id
      WHERE r.type = 'event'
      GROUP BY e.organizer_id
    `);

    const merged = {};
    [...commentReports, ...eventReports].forEach(({ userId, username, report_count }) => {
      if (!merged[userId]) {
        merged[userId] = { userId, username, report_count };
      } else {
        merged[userId].report_count += report_count;
      }
    });

    res.json(Object.values(merged));
  } catch (err) {
    console.error('[ADMIN USERS] fetch reported error:', err);
    res.status(500).json({ error: 'Failed to fetch reported users.' });
  }
});


router.get('/users/banned', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT bc.target_id AS userId, u.username, bc.blocked_at
      FROM blocked_content bc
      JOIN users u ON bc.target_id = u.id
      WHERE bc.type = 'user'
    `);
    res.json(rows);
  } catch (err) {
    console.error('[ADMIN USERS] fetch banned error:', err);
    res.status(500).json({ error: 'Failed to fetch banned users.' });
  }
});


router.post('/users/ban/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const [[exists]] = await pool.promise().query(
      `SELECT * FROM blocked_content WHERE type = 'user' AND target_id = ?`,
      [userId]
    );
    if (exists) return res.status(400).json({ error: 'User is already banned.' });

    await pool.promise().query(
      `INSERT INTO blocked_content (type, target_id) VALUES ('user', ?)`,
      [userId]
    );

    await createNotification(
      userId,
      'You have been banned due to repeated violations of our community rules. Contact support if you believe this is a mistake.',
      true
    );

    res.json({ message: 'User banned and notified.' });
  } catch (err) {
    console.error('[ADMIN USERS] ban error:', err);
    res.status(500).json({ error: 'Failed to ban user.' });
  }
});


router.post('/users/unban/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const [result] = await pool.promise().query(
      `DELETE FROM blocked_content WHERE type = 'user' AND target_id = ?`,
      [userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User was not banned.' });

    res.json({ message: 'User unbanned successfully.' });
  } catch (err) {
    console.error('[ADMIN USERS] unban error:', err);
    res.status(500).json({ error: 'Failed to unban user.' });
  }
});


router.get('/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const [[user]] = await pool.promise().query(
      `SELECT id, username, email, city, age, role, created_at FROM users WHERE id = ?`,
      [userId]
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const [[avgRating]] = await pool.promise().query(
      `SELECT ROUND(AVG(rating), 1) AS average_rating FROM comments WHERE target_user_id = ?`,
      [userId]
    );

    const [comments] = await pool.promise().query(
      `SELECT c.id, c.comment, c.rating, c.created_at, u.username AS author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.target_user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    const [events] = await pool.promise().query(
      `SELECT id, title, date, location FROM events WHERE organizer_id = ? ORDER BY date DESC`,
      [userId]
    );

    res.json({
      user,
      average_rating: avgRating.average_rating || null,
      comments,
      events
    });
  } catch (err) {
    console.error('[ADMIN USER DETAILS ERROR]', err);
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
});

module.exports = router;
