import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const RegisteredUsersPage = () => {
  const { eventId } = useParams(); 
  const [users, setUsers] = useState([]); 
  const [username, setUsername] = useState('User'); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  
  const fetchRegisteredUsers = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;
      if (!token) return setError('Unauthorized'); 

      
      const profileRes = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(profileRes.data.user.username);

      
      const res = await axios.get(`/api/events/${eventId}/registered-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load registered users:', err);
      setError('Failed to load registered users.'); 
    } finally {
      setLoading(false); 
    }
  };

  
  const handleCancelRegistration = async (userId) => {
    const confirm = window.confirm('Are you sure you want to remove this user from the event?');
    if (!confirm) return; 

    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;
      
      await axios.delete(`/api/events/${eventId}/unregister/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('Failed to cancel registration:', err);
      alert('Failed to cancel registration.'); 
    }
  };

  
  useEffect(() => {
    fetchRegisteredUsers();
  }, [eventId]);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} />

      <main className="flex-grow px-6 py-10">
        <motion.div 
          className="bg-panel p-6 rounded-xl max-w-4xl mx-auto shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Here is the list of people registered for this event:
          </motion.h1>

          {}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center">Nobody is registered for this event yet.</p>
          ) : (
           
            <motion.div 
              className="flex flex-col gap-4 max-h-[600px] overflow-y-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  className="flex justify-between items-center bg-gray-300 text-black px-6 py-4 rounded-full"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div>
                    <span className="font-semibold">{user.username}</span> | {user.email}
                  </div>
                  {}
                  <button
                    onClick={() => handleCancelRegistration(user.id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Cancel registration
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisteredUsersPage;
