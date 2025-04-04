const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper'); 


router.post('/:targetUserId', authMiddleware, async (req, res) => {
  const targetUserId = parseInt(req.params.targetUserId);
  const { comment, rating } = req.body;
  const authorId = req.user.id;

  
  if (!comment || !rating || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Invalid comment or rating (must be 1–10).' });
  }

  try {
    
    const query = `
      INSERT INTO comments (user_id, event_id, comment, rating, target_user_id)
      VALUES (?, NULL, ?, ?, ?)
    `;
    await pool.promise().query(query, [authorId, comment, rating, targetUserId]);

    
    const [[authorRow]] = await pool.promise().query(
      'SELECT username FROM users WHERE id = ?',
      [authorId]
    );

    
    const [[settings]] = await pool.promise().query(
      'SELECT on_comment_received FROM notification_settings WHERE user_id = ?',
      [targetUserId]
    );

    const shouldNotify = settings?.on_comment_received === 1;

    
    await createNotification(
      targetUserId,
      `${authorRow.username} left you a comment: "${comment}"`,
      shouldNotify
    );

    res.status(201).json({ message: 'Comment added successfully!' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Server error while adding comment.' });
  }
});


router.get('/:targetUserId', async (req, res) => {
  const targetUserId = parseInt(req.params.targetUserId);

  try {
    const query = `
      SELECT c.id, c.comment, c.rating, c.created_at, u.username AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.target_user_id = ?
      ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.promise().query(query, [targetUserId]);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Server error while fetching comments.' });
  }
});


router.get('/:targetUserId/rating', async (req, res) => {
  const targetUserId = parseInt(req.params.targetUserId);

  try {
    const query = `
      SELECT ROUND(AVG(rating), 1) AS average_rating
      FROM comments
      WHERE target_user_id = ?
    `;
    const [rows] = await pool.promise().query(query, [targetUserId]);

    const rating = rows[0].average_rating || 0;
    res.status(200).json({ rating });
  } catch (err) {
    console.error('Error fetching rating:', err);
    res.status(500).json({ error: 'Server error while fetching rating.' });
  }
});

module.exports = router;
