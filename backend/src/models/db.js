console.log('db.js loaded'); 

require('dotenv').config();
const mysql = require('mysql2');


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'localvibe',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Failed to connect to database:', err.message);
  } else {
    console.log(' Connected to MySQL successfully!');
    connection.release();
  }
});

module.exports = pool;
