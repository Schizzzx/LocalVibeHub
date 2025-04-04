// backend/app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();


const userRoutes = require('./src/routes/userRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const editEventRoutes = require('./src/routes/editEventRoutes'); 
const commentsRoutes = require('./src/routes/commentsRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const supportRoutes = require('./src/routes/supportRoutes');
const favoritesRoutes = require('./src/routes/favoritesRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const testEmailRoutes = require('./src/routes/testEmailRoutes');
const notificationSettingsRoutes = require('./src/routes/notificationSettingsRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const adminSupportRoutes = require('./src/routes/adminSupportRoutes');
const adminContentRoutes = require('./src/routes/adminContentRoutes');
const adminUserRoutes = require('./src/routes/adminUserRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());


const pool = require('./src/models/db');
console.log(" Database connection initialized (db.js loaded)");


app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);        
app.use('/api/events', editEventRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/test', testEmailRoutes);
app.use('/api/notification-settings', notificationSettingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin-support', adminSupportRoutes);
app.use('/api/admin', adminContentRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/chats', chatRoutes);


app.get('/', (req, res) => {
  res.send('🎉 LocalVibe Hub API is running');
});

module.exports = app;
