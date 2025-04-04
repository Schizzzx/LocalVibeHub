const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await pool.promise().query(
      `SELECT e.* FROM favorites f
       JOIN events e ON f.event_id = e.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('[FAVORITES] Fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const { event_id } = req.body;

  if (!event_id) return res.status(400).json({ error: 'Missing event_id' });

  try {
    await pool.promise().query(
      `INSERT IGNORE INTO favorites (user_id, event_id) VALUES (?, ?)`,
      [user_id, event_id]
    );
    res.status(201).json({ message: 'Event added to favorites.' });
  } catch (err) {
    console.error('[FAVORITES] Insert failed:', err);
    res.status(500).json({ error: 'Failed to add to favorites.' });
  }
});


router.delete('/:eventId', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const { eventId } = req.params;

  try {
    await pool.promise().query(
      `DELETE FROM favorites WHERE user_id = ? AND event_id = ?`,
      [user_id, eventId]
    );
    res.json({ message: 'Event removed from favorites.' });
  } catch (err) {
    console.error('[FAVORITES] Deletion failed:', err);
    res.status(500).json({ error: 'Failed to remove from favorites.' });
  }
});

module.exports = router;
