import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const EventDetailsPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [event, setEvent] = useState(null); 
  const [username, setUsername] = useState('User'); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); 

  const fetchEvent = useCallback(async () => {
    try {
      const profileRes = await axios.get('/api/users/profile'); 
      setUsername(profileRes.data.user.username); 

      const res = await axios.get(`/api/events/${id}`); 
      setEvent(res.data); 
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('Failed to load event details.'); 
    }
  }, [id]); 

  
  const handleRegister = async () => {
    try {
      await axios.post(`/api/events/${id}/register`); 
      setMessage('Successfully registered!'); 
    } catch (err) {
      console.error('Registration failed:', err);
      setMessage(err.response?.data?.error || 'Registration failed.'); 
    }
  };

  
  const handleReport = async () => {
    const reason = prompt('Please describe the issue with this event:'); 
    if (!reason || !reason.trim()) return; 

    try {
      await axios.post('/api/reports', {
        report_type: 'event', 
        target_id: Number(id), 
        reason, 
      });
      alert('Thank you. The event has been reported.'); 
    } catch (err) {
      console.error('Report failed:', err);
      alert('Failed to submit report.'); 
    }
  };

  
  const handleAddFavorite = async () => {
    try {
      await axios.post('/api/favorites', {
        event_id: Number(id) 
      });
      setMessage('Event added to favorites!'); 
    } catch (err) {
      console.error('Failed to add favorite:', err);
      setMessage('Failed to add to favorites.'); 
    }
  };

  
  useEffect(() => {
    fetchEvent(); 
  }, [fetchEvent]);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow px-6 py-10">
        <motion.div 
          className="bg-panel p-6 rounded-xl max-w-5xl mx-auto shadow-lg"
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} 
        >
          {}
          {!event ? (
            <p className="text-center text-red-500">{error || 'Loading...'}</p> 
          ) : (
            <>
              <motion.h1 
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }} 
              >
                {event.title} {}
              </motion.h1>

              <div className="mb-4 text-lg">
                <strong>Organiser:</strong>{' '}
                {event.organizer_username ? (
                  <button
                    onClick={() => navigate(`/user/${event.organizer_id}/public-profile`)} 
                    className="text-accent underline hover:text-opacity-80 text-lg font-semibold"
                  >
                    {event.organizer_username} {}
                  </button>
                ) : (
                  'Unknown'
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div className="space-y-2 text-sm" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  {}
                  <p><strong>Address:</strong> {event.location}</p>
                  <p><strong>Time:</strong> {new Date(event.date).toLocaleString()}</p>
                  <p><strong>Age:</strong> {event.age_restriction || 0}+</p>
                  <p><strong>Price:</strong> {event.price || 0} euro</p>
                  <p><strong>Contacts:</strong> {event.contacts || 'N/A'}</p>
                  <p><strong>Link:</strong>{' '}
                    {event.link ? (
                      <a href={event.link} className="text-accent underline hover:text-opacity-80" target="_blank" rel="noreferrer">
                        {event.link} {}
                      </a>
                    ) : 'N/A'}
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white text-black rounded-xl p-6 text-center"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {}
                  {event.image_url ? (
                    <img src={event.image_url} alt="Event" className="w-full h-auto rounded-xl" />
                  ) : (
                    <p className="text-gray-500">No picture provided</p> 
                  )}
                </motion.div>
              </div>

              <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p><strong>Description:</strong></p>
                <p className="text-sm mt-2">{event.description}</p> {}
              </motion.div>

              <motion.div className="mt-6 flex flex-wrap justify-between gap-3 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                {}
                <button
                  onClick={handleReport} 
                  className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
                >
                  Report this event
                </button>

                <button
                  onClick={handleAddFavorite} 
                  className="bg-yellow-400 text-black px-6 py-2 rounded-xl hover:bg-yellow-500"
                >
                  Add to favorites
                </button>

                <button
                  onClick={handleRegister} 
                  className="bg-accent text-black px-6 py-2 rounded-xl"
                >
                  Register
                </button>
              </motion.div>

              {}
              {message && (
                <motion.p className="mt-4 text-center text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {message}
                </motion.p>
              )}
            </>
          )}
        </motion.div>
      </main>
      <Footer /> {}
    </div>
  );
};

export default EventDetailsPage;
