const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM notification_settings WHERE user_id = ?',
      [userId]
    );

    
    if (rows.length === 0) {
      await pool.promise().query(
        `INSERT INTO notification_settings (user_id) VALUES (?)`,
        [userId]
      );
      return res.status(200).json({
        user_id: userId,
        on_event_registration: 0,
        on_event_reminder: 0,
        on_event_change: 0,
        on_event_cancel: 0,
        on_comment_received: 0,
        on_chat_message: 0,
        on_support_reply: 0
      });
    }

    
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(' Failed to get notification settings:', err);
    res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});


router.put('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;


  const {
    on_event_registration = 0,
    on_event_reminder = 0,
    on_event_change = 0,
    on_event_cancel = 0,
    on_comment_received = 0,
    on_chat_message = 0,
    on_support_reply = 0
  } = req.body;

  try {
    await pool.promise().query(
      `REPLACE INTO notification_settings
       (user_id, on_event_registration, on_event_reminder, on_event_change, on_event_cancel,
        on_comment_received, on_chat_message, on_support_reply)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        on_event_registration,
        on_event_reminder,
        on_event_change,
        on_event_cancel,
        on_comment_received,
        on_chat_message,
        on_support_reply
      ]
    );

    res.status(200).json({ message: 'Settings updated successfully.' });
  } catch (err) {
    console.error(' Failed to update notification settings:', err);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

module.exports = router;
