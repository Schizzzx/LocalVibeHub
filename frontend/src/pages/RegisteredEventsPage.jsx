import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisteredEventsPage = () => {
  
  const [events, setEvents] = useState([]);
  const [username, setUsername] = useState('User');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;
      if (!token) return window.location.href = '/?expired=1'; 

      
      const profileRes = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsername(profileRes.data.user.username);

      
      const eventsRes = await axios.get('/api/events/registered', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(eventsRes.data || []);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('accessToken'); 
      window.location.href = '/?expired=1'; 
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchData();
  }, []);

  
  const handleUnregister = async (eventId) => {
    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;
      
      await axios.delete(`/api/events/${eventId}/unregister`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error(err);
      alert('Failed to unregister.'); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background text-text flex flex-col"
    >
      <NavPanelLoggedIn username={username} />

      <main className="flex-grow px-6 py-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-panel p-6 rounded-xl max-w-5xl mx-auto shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-4">Your Events</h1>
          <p className="text-center mb-6">You are registered for:</p>

          {}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-center">You are not registered for any events.</p>
          ) : (
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
              }}
              className="flex flex-col gap-4 max-h-[600px] overflow-y-auto"
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-gray-300 text-black px-6 py-4 rounded-full"
                >
                  {}
                  <Link to={`/event/${event.id}`} className="hover:underline">
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-sm">
                      {event.location} | {event.date} | {event.age_restriction || 0}+ | {event.price || 0} euro
                    </div>
                  </Link>
                  {}
                  <button
                    onClick={() => handleUnregister(event.id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Unregister
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default RegisteredEventsPage;
