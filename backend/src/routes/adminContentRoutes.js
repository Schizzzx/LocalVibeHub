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


router.get('/comment/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.promise().query(
      `SELECT c.id, c.comment, c.rating, c.created_at,
              u.username AS author, u.email AS author_email,
              t.username AS target_username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       JOIN users t ON c.target_user_id = t.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Comment not found.' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('[ADMIN] comment fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch comment.' });
  }
});


router.delete('/comment/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [[comment]] = await pool.promise().query(
      `SELECT c.user_id, t.username AS target_username
       FROM comments c
       JOIN users t ON c.target_user_id = t.id
       WHERE c.id = ?`,
      [id]
    );

    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    await pool.promise().query('DELETE FROM comments WHERE id = ?', [id]);

    const message = `Your comment in the profile of ${comment.target_username} has been removed due to a violation of our community rules. Please respect the rules or your account may be banned.`;
    await createNotification(comment.user_id, message, true);

    res.status(200).json({ message: 'Comment deleted and user notified.' });
  } catch (err) {
    console.error('[ADMIN] comment delete error:', err);
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
});


router.get('/event/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.promise().query(
      `SELECT e.*, u.username AS organizer_username, u.email AS organizer_email
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Event not found.' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('[ADMIN] event fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch event.' });
  }
});

router.delete('/event/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [[event]] = await pool.promise().query(
      'SELECT organizer_id, title FROM events WHERE id = ?',
      [id]
    );

    if (!event) return res.status(404).json({ error: 'Event not found.' });

    await pool.promise().query('DELETE FROM events WHERE id = ?', [id]);

    const message = `Your event "${event.title}" has been removed due to a violation of our community guidelines. One more violation may result in a ban.`;
    await createNotification(event.organizer_id, message, true);

    res.status(200).json({ message: 'Event deleted and organizer notified.' });
  } catch (err) {
    console.error('[ADMIN] event delete error:', err);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

module.exports = router;
