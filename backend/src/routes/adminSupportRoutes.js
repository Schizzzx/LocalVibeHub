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


router.get('/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [messages] = await pool.promise().query(
      'SELECT * FROM support_messages ORDER BY created_at DESC'
    );
    res.status(200).json(messages);
  } catch (err) {
    console.error('[ADMIN SUPPORT] fetch all error:', err);
    res.status(500).json({ error: 'Failed to fetch support messages.' });
  }
});


router.post('/reply/:messageId', authMiddleware, adminOnly, async (req, res) => {
  const { message } = req.body;
  const messageId = req.params.messageId;

 
  if (!message) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  try {
    
    const [[original]] = await pool.promise().query(
      'SELECT user_id FROM support_messages WHERE id = ?',
      [messageId]
    );

    if (!original) {
      return res.status(404).json({ error: 'Support message not found.' });
    }

    const userId = original.user_id;

    
    const [[settings]] = await pool.promise().query(
      'SELECT on_support_reply FROM notification_settings WHERE user_id = ?',
      [userId]
    );

    const shouldNotify = settings?.on_support_reply === 1;

    
    await createNotification(
      userId,
      `Admin replied to your support message: "${message}"`,
      shouldNotify
    );

    res.status(200).json({ message: 'Reply sent successfully.' });
  } catch (err) {
    console.error('[ADMIN SUPPORT ERROR]', err);
    res.status(500).json({ error: 'Failed to send support reply.' });
  }
});

module.exports = router;
