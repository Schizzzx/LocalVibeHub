const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middleware/authMiddleware');


router.put('/:id/edit', authMiddleware, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;
  const {
    title,
    location,
    date,
    price,
    contacts,
    link,
    description,
    category
  } = req.body;

  
  if (!title || !location || !date || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    
    const [[event]] = await pool.promise().query(
      'SELECT organizer_id FROM events WHERE id = ?',
      [eventId]
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.organizer_id !== userId) {
      return res.status(403).json({ error: 'You are not allowed to edit this event.' });
    }

    
    let formattedDate;
    try {
      if (typeof date === 'string' && date.includes('T')) {
        // I stole it. Converts '2025-04-04T08:11:00.000Z' to '2025-04-04 08:11:00'
        formattedDate = date.slice(0, 19).replace('T', ' ');
      } else {
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ error: 'Invalid date format.' });
        }
        formattedDate = parsed.toISOString().slice(0, 19).replace('T', ' ');
      }
    } catch (e) {
      console.error('Date conversion failed:', e);
      return res.status(500).json({ error: 'Server failed to process date.' });
    }

    
    await pool.promise().query(
      `UPDATE events
       SET title = ?, location = ?, date = ?, price = ?, contacts = ?, link = ?, description = ?, category = ?
       WHERE id = ?`,
      [
        title,
        location,
        formattedDate,
        price || 0,
        contacts || '',
        link || '',
        description,
        category,
        eventId
      ]
    );

    res.status(200).json({ message: 'Event updated successfully.' });
  } catch (err) {
    console.error('[EDIT EVENT ERROR]', err);
    res.status(500).json({ error: 'Failed to update event.' });
  }
});

module.exports = router;
