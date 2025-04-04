import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyEventsPage = () => {
  
  const [events, setEvents] = useState([]);
  const [username, setUsername] = useState('User');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const fetchMyEvents = async () => {
    setLoading(true); 
    setError(''); 

    try {
      const token = localStorage.getItem('accessToken') || window.accessToken; 
      if (!token) {
        setError('Unauthorized'); 
        return;
      }

      
      const profileRes = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(profileRes.data.user.username); 

      const eventsRes = await axios.get('/api/events/my-events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(eventsRes.data || []); 
    } catch (err) {
      console.error(err); 
      setError('Failed to load your events.'); 
    } finally {
      setLoading(false); 
    }
  };

  
  const handleDelete = async (eventId) => {
    const confirm = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!confirm) return;
    try {
      const token = localStorage.getItem('accessToken') || window.accessToken; 
      
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e.id !== eventId)); 
    } catch (err) {
      console.error(err); 
      alert('Failed to delete event.'); 
    }
  };

  
  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  
  const handleWatchRegistered = (eventId) => {
    navigate(`/event/${eventId}/registered-users`);
  };

  
  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow px-4 py-10">
        {}
        <motion.div
          className="bg-panel p-4 md:p-6 rounded-2xl max-w-3xl mx-auto shadow-lg"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
        >
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6">Events created by you</h1>

          {}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : events.length === 0 ? ( 
            <p className="text-center">You have not created any events yet.</p>
          ) : (
            <motion.div
              className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1, 
                  }
                }
              }}
            >
              {}
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  className="flex justify-between items-center bg-gray-300 text-black px-4 py-3 rounded-2xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                >
                  {}
                  <Link
                    to={`/event/${event.id}`}
                    className="w-full hover:underline"
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="text-sm truncate">
                      {event.location} | {event.date} | {event.age_restriction || 0}+ | {event.price || 0} euro
                    </div>
                  </Link>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 ml-4 text-sm text-right shrink-0">
                    {}
                    <button
                      onClick={() => handleEditEvent(event.id)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleWatchRegistered(event.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Watch who are registered
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer /> {}
    </div>
  );
};

export default MyEventsPage;
