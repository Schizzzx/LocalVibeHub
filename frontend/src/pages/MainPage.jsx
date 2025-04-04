import React, { useEffect, useState } from 'react';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import axios from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainPage = () => {
  
  const [events, setEvents] = useState([]); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const waitForToken = () => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 10; 
      let attempts = 0;

      const check = () => {
        const token = localStorage.getItem('accessToken') || window.accessToken;
        if (token) return resolve(token); 
        attempts++;
        if (attempts >= maxAttempts) return reject(new Error('Token not found')); 
        setTimeout(check, 100); 
      };

      check();
    });
  };

  
  useEffect(() => {
    const fetchProfileAndEvents = async () => {
      setLoading(true); 
      try {
        const token = await waitForToken(); 

        const profileRes = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` } 
        });

        setUser(profileRes.data.user); 

        const eventsRes = await axios.get('/api/events/recommended', {
          headers: { Authorization: `Bearer ${token}` } 
        });

        setEvents(eventsRes.data || []); 
      } catch (err) {
        console.error('MainPage error:', err); 
        localStorage.removeItem('accessToken'); 
        window.location.href = '/?expired=1'; 
      } finally {
        setLoading(false); 
      }
    };

    fetchProfileAndEvents(); 
  }, []); 

  return (
    <div className="min-h-screen bg-background text-text flex flex-col overflow-hidden">
      {}
      <NavPanelLoggedIn username={user?.username || 'User'} />

      <main className="flex flex-grow px-8 py-10 gap-6 overflow-hidden">
        {}
        <motion.section
          className="w-full max-w-xs bg-panel p-6 rounded-xl shadow-md h-[550px]"
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }} 
        >
          <p className="mb-4 pl-2">Dear <strong>{user?.username || 'user'}</strong>,</p>
          <p className="pl-2">Welcome to the main page of the LocalVibe Hub website.</p>
          <p className="mt-4 pl-2">On this page you will be able to see recommended events in your city and learn more about them.</p>
          <p className="mt-4 pl-2">You can change the data for your recommendations in your profile.</p>
        </motion.section>

        {}
        <motion.section
          className="flex-1 bg-panel p-6 rounded-xl shadow-md h-[550px] overflow-y-auto"
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }} 
        >
          <h2 className="text-xl font-bold mb-4 text-center">Your recommendations</h2>

          {loading ? ( 
            <p className="text-center">Loading...</p>
          ) : error ? ( 
            <p className="text-center text-red-500">{error}</p>
          ) : events.length > 0 ? ( 
            <div className="flex flex-col gap-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.05 }} 
                >
                  <Link
                    to={`/event/${event.id}`} 
                    className="flex flex-col bg-gray-300 text-black px-6 py-4 rounded-xl shadow-md hover:bg-gray-200 transition duration-300"
                  >
                    <span className="font-semibold text-lg mb-1">{event.title}</span>
                    <span className="text-sm">
                      {event.location} | {new Date(event.date).toLocaleString()} | {event.age_restriction || 0}+ | {event.price || 0} euro
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : ( 
            <p className="text-center text-sm">No recommendations found.</p>
          )}
        </motion.section>
      </main>

      {}
      <Footer />
    </div>
  );
};

export default MainPage;
