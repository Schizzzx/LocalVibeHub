const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function createNotification(userId, message, sendEmail = false) {
  try {
    
    await pool.promise().query(
      'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, 0)',
      [userId, message]
    );

    
    if (sendEmail) {
      const [userRows] = await pool.promise().query(
        'SELECT email FROM users WHERE id = ?',
        [userId]
      );
      if (userRows.length === 0) return;

      const to = userRows[0].email;

     
      await transporter.sendMail({
        from: `"LocalVibe" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'You have a new notification',
        text: message,
      });
    }
  } catch (err) {
    console.error(' Error creating/sending notification:', err);
  }
}


router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(' Failed to fetch notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});


router.get('/unread-count', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.promise().query(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    res.status(200).json({ count: rows[0].count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ error: 'Failed to fetch unread notifications count.' });
  }
});


router.patch('/:id/read', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  try {
    await pool.promise().query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error(' Failed to mark notification as read:', err);
    res.status(500).json({ error: 'Failed to update notification status.' });
  }
});


router.patch('/mark-all-read', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.promise().query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
      [userId]
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(' Failed to mark all notifications as read:', err);
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
});

module.exports = router;
