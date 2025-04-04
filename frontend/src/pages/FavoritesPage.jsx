import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]); 
  const [username, setUsername] = useState('User'); 
  const navigate = useNavigate(); 

  
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('accessToken'); 
      if (!token) return navigate('/?expired=1');

      
      const profileRes = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(profileRes.data.user.username); 

      
      const res = await axios.get('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data); 
    } catch (err) {
      console.error('Failed to load favorites:', err); 
    }
  };

  useEffect(() => {
    fetchFavorites(); 
  }, []);

  
  const handleRemove = async (eventId) => {
    try {
      const token = localStorage.getItem('accessToken'); 
      
      await axios.delete(`/api/favorites/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((event) => event.id !== eventId)); 
    } catch (err) {
      console.error('Failed to remove favorite:', err); 
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto">
        <motion.h1 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
        >
          Your Favorite Events
        </motion.h1>

        <AnimatePresence>
          {favorites.length === 0 ? ( 
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
            >
              You haven’t added any events to favorites yet.
            </motion.p>
          ) : (
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }, 
              }}
            >
              {favorites.map((event) => ( 
                <motion.div
                  key={event.id}
                  className="bg-panel-light p-4 rounded-xl shadow flex justify-between items-center"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                >
                  <div>
                    <p className="text-lg font-semibold">{event.title}</p> {}
                    <p className="text-sm text-gray-400">{new Date(event.date).toLocaleString()}</p> {}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => navigate(`/event/${event.id}`)} 
                      className="bg-accent text-black px-4 py-1.5 rounded-xl text-sm hover:bg-opacity-80"
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                    >
                      View
                    </motion.button>
                    <motion.button
                      onClick={() => handleRemove(event.id)} 
                      className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-red-600"
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer /> {}
    </div>
  );
};

export default FavoritesPage;
