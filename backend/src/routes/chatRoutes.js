const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper');


router.get('/list', authMiddleware, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      sub.partner_id AS id,
      u.username,
      MAX(sub.created_at) AS last_message_time,
      SUM(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 ELSE 0 END) AS unread_count
    FROM (
      SELECT 
        CASE
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END AS partner_id,
        created_at
      FROM chat_messages
      WHERE sender_id = ? OR receiver_id = ?
    ) sub
    JOIN users u ON u.id = sub.partner_id
    JOIN chat_messages m ON 
      ((m.sender_id = ? AND m.receiver_id = sub.partner_id) OR 
       (m.sender_id = sub.partner_id AND m.receiver_id = ?))
    GROUP BY sub.partner_id, u.username
    ORDER BY last_message_time DESC
  `;

  pool.query(query, [userId, userId, userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error('[CHAT LIST ERROR]', err);
      return res.status(500).json({ error: 'Failed to fetch chat list.' });
    }
    res.status(200).json(results);
  });
});


router.get('/:partnerId', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const partnerId = parseInt(req.params.partnerId);

  if (isNaN(partnerId)) {
    return res.status(400).json({ error: 'Invalid partner ID' });
  }

  const query = `
    SELECT * FROM chat_messages
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  pool.query(query, [userId, partnerId, partnerId, userId], (err, results) => {
    if (err) {
      console.error('[CHAT MESSAGES ERROR]', err);
      return res.status(500).json({ error: 'Failed to fetch messages.' });
    }

    
    pool.query(
      'UPDATE chat_messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [partnerId, userId],
      () => {} 
    );

    res.status(200).json(results);
  });
});


router.post('/:partnerId', authMiddleware, (req, res) => {
  const senderId = req.user.id;
  const receiverId = parseInt(req.params.partnerId);
  const { message } = req.body;

  if (!message || isNaN(receiverId)) {
    return res.status(400).json({ error: 'Message and receiver are required.' });
  }

  const query = `
    INSERT INTO chat_messages (sender_id, receiver_id, message, is_read)
    VALUES (?, ?, ?, 0)
  `;

  pool.query(query, [senderId, receiverId, message], (err) => {
    if (err) {
      console.error('[SEND MESSAGE ERROR]', err);
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    
    pool.query(
      'SELECT on_chat_message FROM notification_settings WHERE user_id = ?',
      [receiverId],
      (err, settingsRows) => {
        if (err) return;

        if (settingsRows[0]?.on_chat_message === 1) {
          
          pool.query(
            'SELECT username FROM users WHERE id = ?',
            [senderId],
            (err, senderRows) => {
              if (err) return;
              const notifyText = `${senderRows[0].username} sent you a new message.`;
              createNotification(receiverId, notifyText, true);
            }
          );
        }
      }
    );

    res.status(201).json({ message: 'Message sent successfully.' });
  });
});

module.exports = router;
