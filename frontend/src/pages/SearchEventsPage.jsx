import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const categoryOptions = [
  'Concerts', 'Excursions', 'Board Games', 'Workshops',
  'Art', 'Tech', 'Parties', 'Networking'
];

const cityOptions = ['Riga']; 

const SearchEventsPage = () => {
  const [query, setQuery] = useState(''); 
  const [events, setEvents] = useState([]); 
  const [isFree, setIsFree] = useState(null); 
  const [city, setCity] = useState(''); 
  const [category, setCategory] = useState(''); 
  const [date, setDate] = useState(''); 
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('User');
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('accessToken') || window.accessToken;
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.user.username); 
      } catch (err) {
        console.error('Error fetching username:', err); 
      }
    };
    fetchUsername();
  }, []);

  
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;
      const params = {
        q: query, 
        city, 
        category, 
        date, 
        free: isFree === null ? '' : isFree ? 1 : 0, 
      };

      
      const { data } = await axios.get('http://localhost:5000/api/events/search', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setEvents(data); 
      setMessage(data.length === 0 ? 'Sorry, nothing was found.' : ''); 
    } catch (err) {
      console.error('Search error:', err); 
      setMessage('Error while searching.'); 
    }
  };

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  
  const handleClickEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="bg-panel p-6 rounded-xl w-full max-w-5xl shadow-lg flex flex-col gap-6"
        >
          <h1 className="text-xl font-bold text-center">What are you searching for</h1>

          {}
          <motion.input
            type="text"
            placeholder="Search by keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} 
            className="w-full px-4 py-2 rounded-full bg-white text-black"
            whileFocus={{ scale: 1.02 }}
          />

          {}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center items-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {}
            <motion.div className="flex items-center gap-2">
              <span>Free?</span>
              {[true, false, null].map((val, i) => (
                <motion.button
                  key={i}
                  className={`px-4 py-1 rounded-full ${isFree === val ? 'bg-accent text-black' : 'bg-gray-600 text-white'}`}
                  onClick={() => setIsFree(val)} 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {val === null ? 'Reset' : val ? 'Yes' : 'No'}
                </motion.button>
              ))}
            </motion.div>

            {}
            <motion.select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2 rounded bg-white text-black"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">Select City</option>
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)} {}
            </motion.select>

            {}
            <motion.select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded bg-white text-black"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)} {}
            </motion.select>

            {}
            <motion.input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded bg-white text-black"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {}
          <div className="bg-gray-800 p-4 rounded-xl max-h-[400px] overflow-y-auto">
            {message && <p className="text-center text-sm text-white mb-4">{message}</p>}
            <motion.div 
              className="flex flex-col gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } }
              }}
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  onClick={() => handleClickEvent(event.id)} 
                  className="cursor-pointer bg-gray-300 text-black px-6 py-4 rounded-full hover:bg-gray-400 transition"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm">
                    {event.location} | {event.date} | {event.age_restriction || 0}+ | {event.price || 0} euro
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchEventsPage;
