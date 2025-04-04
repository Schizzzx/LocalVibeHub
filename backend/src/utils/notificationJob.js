const cron = require('node-cron');
const pool = require('../models/db');
const { createNotification } = require('./notificationHelper');


cron.schedule('0 9 * * *', async () => {
  console.log('[CRON] Running daily event reminder job...');

  try {
    const [events] = await pool.promise().query(
      `SELECT e.id, e.title, e.date, r.user_id
       FROM events e
       JOIN registrations r ON e.id = r.event_id
       JOIN notification_settings ns ON r.user_id = ns.user_id
       WHERE ns.on_event_reminder = 1
         AND DATE(e.date) = CURDATE() + INTERVAL 1 DAY`
    );

    for (const event of events) {
      const message = `Reminder: Your event "${event.title}" is happening tomorrow!`;
      await createNotification(event.user_id, message, true);
      console.log(`[CRON] Reminder sent to user ${event.user_id} for event ${event.id}`);
    }
  } catch (err) {
    console.error('[CRON] Reminder job error:', err);
  }
});
