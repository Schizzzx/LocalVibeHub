const pool = require('../models/db');
const nodemailer = require('nodemailer');


console.log('[DEBUG] EMAIL_USER:', process.env.EMAIL_USER);
console.log('[DEBUG] EMAIL_PASS:', process.env.EMAIL_PASS ? ' Loaded' : ' EMPTY');


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailersend.net',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', 
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
    console.log(`[DEBUG] Notification inserted into DB for user ${userId}`);

   
    if (sendEmail) {
      const [[user]] = await pool.promise().query(
        'SELECT email FROM users WHERE id = ?',
        [userId]
      );

      if (!user || !user.email) {
        console.warn(`[DEBUG] No email found for user ID ${userId}`);
        return;
      }

      console.log(`[DEBUG] Preparing to send email to: ${user.email}`);
      console.log(`[DEBUG] Email message:`, message);

      try {
        await transporter.sendMail({
          from: `"LocalVibe Hub" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'New Notification',
          text: message,
        });
        console.log(`[DEBUG] Email sent successfully to ${user.email}`);
      } catch (emailErr) {
        console.error(' Email send error:', emailErr);
      }
    } else {
      console.log(`[DEBUG] Email sending skipped for user ${userId} (setting = false)`);
    }
  } catch (err) {
    console.error(' Notification error:', err);
  }
}

module.exports = { createNotification };
