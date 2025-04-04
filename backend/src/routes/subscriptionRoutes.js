const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/:followedId', authMiddleware, async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.followedId);

  if (followerId === followedId) {
    return res.status(400).json({ error: 'You cannot subscribe to yourself.' });
  }

  try {
    await pool.promise().query(
      'INSERT IGNORE INTO subscriptions (follower_id, followed_id) VALUES (?, ?)',
      [followerId, followedId]
    );
    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (err) {
    console.error('[SUBSCRIBE ERROR]:', err);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});


router.delete('/:followedId', authMiddleware, async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.followedId);

  try {
    await pool.promise().query(
      'DELETE FROM subscriptions WHERE follower_id = ? AND followed_id = ?',
      [followerId, followedId]
    );
    res.status(200).json({ message: 'Unsubscribed successfully.' });
  } catch (err) {
    console.error('[UNSUBSCRIBE ERROR]:', err);
    res.status(500).json({ error: 'Failed to unsubscribe.' });
  }
});


router.get('/:followedId/status', authMiddleware, async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.followedId);

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM subscriptions WHERE follower_id = ? AND followed_id = ?',
      [followerId, followedId]
    );

    res.status(200).json({ subscribed: rows.length > 0 });
  } catch (err) {
    console.error('[CHECK SUBSCRIPTION ERROR]:', err);
    res.status(500).json({ error: 'Failed to check subscription.' });
  }
});


router.get('/:id', authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const [rows] = await pool.promise().query(
      `SELECT u.id, u.username, u.city, u.age
       FROM users u
       JOIN subscriptions s ON s.followed_id = u.id
       WHERE s.follower_id = ?`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('[GET SUBSCRIPTIONS BY ID ERROR]:', err);
    res.status(500).json({ error: 'Failed to load subscriptions.' });
  }
});


router.get('/my/list', authMiddleware, async (req, res) => {
  const followerId = req.user.id;

  try {
    const [rows] = await pool.promise().query(
      `SELECT u.id, u.username, u.city, u.age
       FROM users u
       JOIN subscriptions s ON s.followed_id = u.id
       WHERE s.follower_id = ?`,
      [followerId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('[GET MY SUBSCRIPTIONS ERROR]:', err);
    res.status(500).json({ error: 'Failed to load subscriptions.' });
  }
});

module.exports = router;
