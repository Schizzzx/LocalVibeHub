import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotificationCenterPage = () => {
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [settings, setSettings] = useState({
    on_event_registration: false,
    on_event_reminder: false,
    on_event_change: false,
    on_event_cancel: false,
    on_comment_received: false,
    on_chat_message: false,
    on_support_action: false,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken') || window.accessToken;

  
  useEffect(() => {
    if (!token) return navigate('/login');

    const headers = { Authorization: `Bearer ${token}` };

    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', { headers });
        setUsername(res.data.username);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          console.error('User load error:', err);
        }
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications', { headers });
        setNotifications(res.data);
        await axios.patch('/api/notifications/mark-all-read', {}, { headers });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          console.error('Notification load error:', err);
        }
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/notification-settings', { headers });
        setSettings(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          console.error('Settings load error:', err);
        }
      }
    };

    
    fetchUser();
    fetchNotifications();
    fetchSettings();
    setLoading(false);
  }, [navigate, token]);

  
  const handleSettingChange = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  
  const handleSaveSettings = async () => {
    try {
      await axios.put('/api/notification-settings', settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text overflow-hidden">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow p-8 flex justify-center gap-8 items-start overflow-hidden">
        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-[45%] h-[550px] bg-[#1C1B22] rounded-3xl shadow-lg p-6 overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Your Notifications</h2>
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-center">You have no notifications yet.</p>
          ) : (
            <ul className="space-y-4">
              {}
              {notifications.map((n) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-600 shadow-sm text-white"
                >
                  <div className="flex justify-between items-center">
                    <p>{n.message}</p>
                    {!n.is_read && (
                      <span className="ml-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-[45%] h-[550px] bg-[#1C1B22] rounded-3xl shadow-lg p-6 flex flex-col justify-between text-white"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Notification Settings</h2>

            <div className="space-y-4">
              {}
              {Object.keys(settings).map(
                (key) =>
                  key !== 'user_id' && (
                    <motion.label
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-between items-center capitalize"
                    >
                      <span>{key.replace(/_/g, ' ')}</span>
                      <input
                        type="checkbox"
                        checked={!!settings[key]}
                        onChange={() => handleSettingChange(key)}
                      />
                    </motion.label>
                  )
              )}
            </div>
          </div>

          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            className="w-full mt-6 bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80"
          >
            Save Settings
          </motion.button>
        </motion.div>
      </main>

      <Footer /> {}
    </div>
  );
};

export default NotificationCenterPage;
