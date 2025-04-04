const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationHelper');


router.post('/create', authMiddleware, (req, res) => {
  
  const {
    title, description, date, location,
    category, max_participants = 100, price = 0,
    image_url = '', contacts, link
  } = req.body;

  if (!title || !description || !date || !location || !category) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  const organizer_id = req.user?.id;
  if (!organizer_id) return res.status(401).json({ error: "Invalid or missing access token." });

  const cleanedContacts = contacts?.trim() || null;
  const cleanedLink = link?.trim() || null;

  
  const query = `
    INSERT INTO events (
      title, description, date, location, category,
      max_participants, price, image_url,
      organizer_id, contacts, link
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    title, description, date, location, category,
    max_participants, price, image_url,
    organizer_id, cleanedContacts, cleanedLink
  ];

  pool.query(query, values, (err) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).json({ error: "Error creating event." });
    }
    res.status(201).json({ message: "Event successfully created!" });
  });
});


router.get('/', (req, res) => {
  pool.query("SELECT * FROM events", (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching events." });
    res.status(200).json(results);
  });
});


router.get('/search', authMiddleware, async (req, res) => {
  const { q, free, city, category, date } = req.query;
  try {
    let query = 'SELECT * FROM events WHERE 1=1';
    const values = [];

    if (q) {
      query += ' AND title LIKE ?';
      values.push(`%${q}%`);
    }
    if (free === '1') query += ' AND price = 0';
    if (free === '0') query += ' AND price > 0';
    if (city) {
      query += ' AND location LIKE ?';
      values.push(`%${city}%`);
    }
    if (category) {
      query += ' AND category = ?';
      values.push(category);
    }
    if (date) {
      query += ' AND DATE(date) = ?';
      values.push(date);
    }

    query += ' ORDER BY date ASC';
    const [events] = await pool.promise().query(query, values);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Server error while searching events.' });
  }
});


router.get('/my-events', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const [events] = await pool.promise().query(
      'SELECT * FROM events WHERE organizer_id = ? ORDER BY date DESC',
      [userId]
    );
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching user events:', err);
    res.status(500).json({ error: 'Failed to load your events.' });
  }
});


router.get('/registered', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const [events] = await pool.promise().query(
      `SELECT e.*
       FROM events e
       JOIN registrations r ON e.id = r.event_id
       WHERE r.user_id = ?
       ORDER BY e.date ASC`,
      [userId]
    );
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching registered events:', err);
    res.status(500).json({ error: 'Failed to load your registered events.' });
  }
});


router.delete('/:eventId/unregister/:userId', authMiddleware, async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const [result] = await pool.promise().query(
      'DELETE FROM registrations WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    res.status(200).json({ message: 'User successfully unregistered from the event.' });
  } catch (err) {
    console.error('Admin unregister error:', err);
    res.status(500).json({ error: 'Failed to unregister user from the event.' });
  }
});


router.get('/:id/registered-users', authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  try {
    const [users] = await pool.promise().query(
      `SELECT u.id, u.username, u.email
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ?`,
      [eventId]
    );
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching registered users:', err);
    res.status(500).json({ error: 'Failed to load registered users.' });
  }
});


router.post('/:id/register', authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  try {
    const [check] = await pool.promise().query(
      'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );
    if (check.length > 0) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    await pool.promise().query(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [userId, eventId]
    );

    
    const [[event]] = await pool.promise().query('SELECT * FROM events WHERE id = ?', [eventId]);
    const [[user]] = await pool.promise().query('SELECT username FROM users WHERE id = ?', [userId]);
    const [[settings]] = await pool.promise().query('SELECT * FROM notification_settings WHERE user_id = ?', [event.organizer_id]);

    const shouldNotify = settings?.on_event_registration === 1;
    await createNotification(event.organizer_id, `${user.username} has registered for your event "${event.title}"`, shouldNotify);
    res.status(201).json({ message: 'Successfully registered!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});


router.delete('/:id/unregister', authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  try {
    await pool.promise().query(
      'DELETE FROM registrations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );
    res.status(200).json({ message: 'Successfully unregistered from event.' });
  } catch (err) {
    console.error('Unregister error:', err);
    res.status(500).json({ error: 'Failed to unregister.' });
  }
});


router.put('/:id/edit', authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  const organizerId = req.user.id;
  const {
    title, description, date, location,
    category, max_participants, price,
    image_url, contacts, link,
    age_restriction
  } = req.body;

  try {
    const updateQuery = `
      UPDATE events SET
        title = ?, description = ?, date = ?, location = ?, category = ?,
        max_participants = ?, price = ?, image_url = ?, contacts = ?, link = ?, age_restriction = ?
      WHERE id = ? AND organizer_id = ?
    `;

    const values = [
      title, description, date, location, category,
      max_participants, price, image_url, contacts, link,
      age_restriction, eventId, organizerId
    ];

    const [result] = await pool.promise().query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or event not found.' });
    }

    
    const [users] = await pool.promise().query(
      'SELECT u.id FROM registrations r JOIN users u ON r.user_id = u.id WHERE r.event_id = ?',
      [eventId]
    );

    for (const user of users) {
      const [[settings]] = await pool.promise().query('SELECT * FROM notification_settings WHERE user_id = ?', [user.id]);
      if (settings?.on_event_change === 1) {
        await createNotification(user.id, `The event "${title}" has been updated.`, true);
      }
    }

    res.status(200).json({ message: 'Event updated successfully.' });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event.' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const [users] = await pool.promise().query(
      'SELECT user_id FROM registrations WHERE event_id = ?', [eventId]
    );

    await pool.promise().query('DELETE FROM registrations WHERE event_id = ?', [eventId]);

    const [result] = await pool.promise().query(
      'DELETE FROM events WHERE id = ? AND organizer_id = ?',
      [eventId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or event not found.' });
    }

    for (const row of users) {
      const [[settings]] = await pool.promise().query('SELECT * FROM notification_settings WHERE user_id = ?', [row.user_id]);
      if (settings?.on_event_cancel === 1) {
        await createNotification(row.user_id, `The event you registered for has been canceled.`, true);
      }
    }

    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});


router.get('/recommended', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const [userRows] = await pool.promise().query('SELECT city FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userCity = userRows[0].city;
    const [interestsRows] = await pool.promise().query('SELECT interest FROM interests WHERE user_id = ?', [userId]);

    if (interestsRows.length === 0) return res.status(200).json([]);

    const interests = interestsRows.map(row => row.interest);
    const placeholders = interests.map(() => '?').join(',');

    const [recommended] = await pool.promise().query(
      `SELECT * FROM events WHERE category IN (${placeholders}) AND location LIKE ? ORDER BY date ASC`,
      [...interests, `%${userCity}%`]
    );

    res.status(200).json(recommended);
  } catch (err) {
    console.error('Error getting recommended:', err);
    res.status(500).json({ error: 'Error getting recommended events' });
  }
});

// Get event by ID (must be last route or the token will expire (имидиатли))
//
router.get('/:id', authMiddleware, async (req, res) => {
  const eventId = req.params.id;
  try {
    const [results] = await pool.promise().query(
      'SELECT * FROM events WHERE id = ?', [eventId]
    );
    if (results.length === 0) return res.status(404).json({ error: 'Event not found.' });

    const event = results[0];
    const [organizerResult] = await pool.promise().query(
      'SELECT username FROM users WHERE id = ?', [event.organizer_id]
    );

    event.organizer_username = organizerResult.length > 0
      ? organizerResult[0].username
      : 'Unknown';

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ error: 'Server error while fetching event.' });
  }
});
//
//


module.exports = router;
