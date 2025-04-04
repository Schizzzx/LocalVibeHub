const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper');


router.post('/', authMiddleware, async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.user.id;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required.' });
  }

  try {
    await pool.promise().query(
      'INSERT INTO support_messages (user_id, subject, message) VALUES (?, ?, ?)',
      [userId, subject, message]
    );

    res.status(201).json({ message: 'Your support request has been submitted!' });
  } catch (err) {
    console.error('[SUPPORT ERROR]', err);
    res.status(500).json({ error: 'Failed to submit support request.' });
  }
});


router.get('/:id', authMiddleware, async (req, res) => {
  const messageId = req.params.id;

  try {
    const [[message]] = await pool.promise().query(
      `SELECT sm.id, sm.subject, sm.message, sm.created_at, u.email
       FROM support_messages sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.id = ?`,
      [messageId]
    );

    if (!message) {
      return res.status(404).json({ error: 'Support message not found.' });
    }

    res.status(200).json(message);
  } catch (err) {
    console.error('[GET SUPPORT MESSAGE ERROR]', err);
    res.status(500).json({ error: 'Failed to load support message.' });
  }
});


router.post('/reply/:supportMessageId', authMiddleware, async (req, res) => {
  const supportMessageId = req.params.supportMessageId;
  const { reply } = req.body;
  const adminId = req.user.id;

  if (!reply || !supportMessageId) {
    return res.status(400).json({ error: 'Reply text is required.' });
  }

  try {
    
    const [[admin]] = await pool.promise().query(
      'SELECT role FROM users WHERE id = ?',
      [adminId]
    );

    if (admin.role !== 1) {
      return res.status(403).json({ error: 'Only admins can send replies.' });
    }

    
    const [[original]] = await pool.promise().query(
      'SELECT user_id, subject FROM support_messages WHERE id = ?',
      [supportMessageId]
    );

    if (!original) {
      return res.status(404).json({ error: 'Support message not found.' });
    }

    const userId = original.user_id;

    
    const notificationText = `Admin has replied to your support request "${original.subject}": ${reply}`;

    
    const [[settings]] = await pool.promise().query(
      'SELECT on_support_reply FROM notification_settings WHERE user_id = ?',
      [userId]
    );

    const shouldNotify = settings?.on_support_reply === 1;

    
    await createNotification(userId, notificationText, shouldNotify);

    res.status(200).json({ message: 'Reply sent and user notified.' });
  } catch (err) {
    console.error('[ADMIN REPLY ERROR]', err);
    res.status(500).json({ error: 'Failed to send reply.' });
  }
});

module.exports = router;
