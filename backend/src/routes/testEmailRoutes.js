const express = require('express');
const router = express.Router();
const sendEmail = require('../../services/emailService'); 


router.post('/test-email', async (req, res) => {
  try {
    await sendEmail({
      to: 'lcoalvibe.noreply@gmail.com', 
      subject: ' LocalVibe Email Test',
      text: 'This is a real test email from LocalVibe Hub backend.',
    });

    res.status(200).json({ message: ' Test email was sent successfully!' });
  } catch (err) {
    console.error('Failed to send email:', err);
    res.status(500).json({ error: 'Email send failed.' });
  }
});

module.exports = router;
