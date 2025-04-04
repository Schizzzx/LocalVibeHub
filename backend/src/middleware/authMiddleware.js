const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../models/db');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access token missing." });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    
    const [rows] = await pool.promise().query(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

  
    req.user = {
      id: rows[0].id,
      username: rows[0].username,
      email: rows[0].email,
      role: rows[0].role,
    };

    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE ERROR]', error);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
