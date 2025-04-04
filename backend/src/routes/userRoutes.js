const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
require('dotenv').config();
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error.' });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email is already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;

    pool.query(insertQuery, [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register user.' });

      const userId = result.insertId;
      const accessToken = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

      pool.query("INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)", [userId, refreshToken]);

      res.status(201).json({
        message: 'Registration successful!',
        user: { id: userId, username, email, role: 0 },
        accessToken,
        refreshToken
      });
    });
  });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password." });
  }

  pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error.' });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email or password." });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password." });

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    pool.query("INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)", [user.id, refreshToken]);

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 0
      },
      accessToken,
      refreshToken
    });
  });
});


router.post('/setup-profile', authMiddleware, (req, res) => {
  const { username, city, age, interests } = req.body;
  const userId = req.user.id;

  if (!username || !city || !age || !Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({ error: "Incomplete setup data." });
  }

  const updateQuery = `UPDATE users SET username = ?, city = ?, age = ? WHERE id = ?`;

  pool.query(updateQuery, [username, city, age, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update profile.' });

    const insertInterestQuery = `INSERT INTO interests (user_id, interest) VALUES ?`;
    const interestValues = interests.map((interest) => [userId, interest]);

    pool.query(insertInterestQuery, [interestValues], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save interests.' });

      res.status(200).json({ message: 'Profile setup completed!' });
    });
  });
});


router.put('/profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { username, city, age, interests } = req.body;

  if (!username || !city || !age || !Array.isArray(interests)) {
    return res.status(400).json({ error: "Incomplete profile data." });
  }

  try {
    await pool.promise().query(
      'UPDATE users SET username = ?, city = ?, age = ? WHERE id = ?',
      [username, city, age, userId]
    );

    await pool.promise().query('DELETE FROM interests WHERE user_id = ?', [userId]);

    const interestValues = interests.map((interest) => [userId, interest]);
    await pool.promise().query('INSERT INTO interests (user_id, interest) VALUES ?', [interestValues]);

    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});


router.get('/profile', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [userRows] = await pool.promise().query(
      'SELECT id, username, email, city, age FROM users WHERE id = ?',
      [userId]
    );
    if (userRows.length === 0) return res.status(404).json({ error: "User not found." });

    const user = userRows[0];

    const [ratingRows] = await pool.promise().query(
      'SELECT ROUND(AVG(rating), 1) AS average_rating FROM comments WHERE target_user_id = ?',
      [userId]
    );
    user.averageRating = ratingRows[0].average_rating ?? null;

    const [comments] = await pool.promise().query(
      `SELECT c.comment, c.rating, c.created_at, u.username AS author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.target_user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.status(200).json({ message: "Access granted!", user, comments });
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});


router.get('/:id/public-profile', authMiddleware, async (req, res) => {
  const targetUserId = req.params.id;

  try {
    const [users] = await pool.promise().query(
      'SELECT id, username, city FROM users WHERE id = ?',
      [targetUserId]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const [comments] = await pool.promise().query(
      'SELECT comment, rating, created_at, user_id FROM comments WHERE target_user_id = ? ORDER BY created_at DESC',
      [targetUserId]
    );

    const [avgRows] = await pool.promise().query(
      'SELECT ROUND(AVG(rating), 1) AS average_rating FROM comments WHERE target_user_id = ?',
      [targetUserId]
    );

    const averageRating = avgRows.length > 0 && avgRows[0].average_rating !== null
      ? parseFloat(avgRows[0].average_rating)
      : null;

    const [pastEvents] = await pool.promise().query(
      'SELECT id, title, date FROM events WHERE organizer_id = ? AND date < NOW() ORDER BY date DESC',
      [targetUserId]
    );

    res.status(200).json({
      user: users[0],
      rating: averageRating,
      comments,
      pastEvents
    });
  } catch (err) {
    console.error('Error fetching public profile:', err);
    res.status(500).json({ error: 'Failed to load public profile.' });
  }
});


router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token is required." });

  pool.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken], (err) => {
    if (err) return res.status(500).json({ error: "Server error during logout." });
    res.status(200).json({ message: "You have been logged out." });
  });
});


router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token is required." });

  pool.query("SELECT * FROM refresh_tokens WHERE token = ?", [refreshToken], (err, results) => {
    if (err) return res.status(500).json({ error: "Server error during refresh." });

    if (results.length === 0) {
      return res.status(403).json({ error: "Invalid refresh token." });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid or expired refresh token." });

      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ accessToken: newAccessToken });
    });
  });
});


router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.promise().query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

module.exports = router;
