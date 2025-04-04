import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SubscribedOrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]); 
  const [username, setUsername] = useState('User'); 
  const navigate = useNavigate(); 

  
  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;
      if (!token) return navigate('/?expired=1'); 

      
      const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(profileRes.data.user.username); 

      
      const res = await axios.get('http://localhost:5000/api/subscriptions/my/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizers(res.data); 
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    }
  };

  
  const handleUnsubscribe = async (organizerId) => {
    const token = localStorage.getItem('accessToken') || window.accessToken;
    try {
      
      await axios.delete(`http://localhost:5000/api/subscriptions/${organizerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setOrganizers((prev) => prev.filter((org) => org.id !== organizerId));
    } catch (err) {
      console.error('Unsubscribe failed:', err);
    }
  };

  
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow px-6 py-10">
        <motion.div
          className="max-w-4xl mx-auto bg-panel p-6 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-center mb-6">Your Subscriptions</h1>

          <AnimatePresence>
            {}
            {organizers.length === 0 ? (
              <motion.p
                className="text-center text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                You are not subscribed to any organizers yet.
              </motion.p>
            ) : (
              
              <motion.ul
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {organizers.map((org) => (
                  <motion.li
                    key={org.id}
                    className="bg-background-light p-4 rounded-xl flex justify-between items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div>
                      <p className="font-semibold">{org.username}</p>
                      <p className="text-sm text-gray-400">{org.city}</p>
                    </div>
                    <div className="flex gap-2">
                      {}
                      <motion.button
                        onClick={() => navigate(`/user/${org.id}/public-profile`)}
                        className="bg-accent text-black px-4 py-1.5 rounded-xl text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Profile
                      </motion.button>
                      {}
                      <motion.button
                        onClick={() => handleUnsubscribe(org.id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-red-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Unsubscribe
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer /> {}
    </div>
  );
};

export default SubscribedOrganizersPage;
