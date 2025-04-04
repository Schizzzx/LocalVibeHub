import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';


const categories = ['Concerts', 'Art', 'Sports', 'Tech', 'Networking', 'Education', 'Food', 'Games'];

const EditEventPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const token = localStorage.getItem('accessToken'); 

  
  const [username, setUsername] = useState('');
  const [eventData, setEventData] = useState({
    title: '',
    location: '',
    date: '',
    price: '',
    contacts: '',
    link: '',
    description: '',
    category: '',
  });
  const [error, setError] = useState(''); 

  
  useEffect(() => {
    if (!token) return navigate('/login'); 

    
    const fetchEventData = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEventData(res.data); 
      } catch (err) {
        console.error('Failed to load event:', err); 
        setError('Failed to load event data.'); 
      }
    };

    
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me');
        setUsername(res.data.username); 
      } catch (err) {
        console.error('Failed to load user:', err); 
        localStorage.removeItem('accessToken'); 
        navigate('/login'); 
      }
    };

    fetchUser(); 
    fetchEventData(); 
  }, [id, navigate, token]);

  
  const handleChange = (e) => {
    const { name, value } = e.target; 
    setEventData((prev) => ({ ...prev, [name]: value })); 
  };

  
  const handleCategorySelect = (selectedCategory) => {
    setEventData((prev) => ({ ...prev, category: selectedCategory })); 
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      
      await axios.put(`/api/events/${id}/edit`, eventData);
      alert('Event updated successfully!'); 
      navigate('/my-events'); 
    } catch (err) {
      console.error('Failed to update event:', err); 
      alert('Failed to update event.'); 
    }
  };

  return (
    <div className="h-screen bg-background text-text flex flex-col overflow-hidden">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow p-6 flex justify-center items-center overflow-hidden">
        <motion.div
          className="w-full max-w-3xl h-[600px] bg-panel p-6 rounded-xl shadow-md overflow-y-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-2xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Edit Event
          </motion.h1>

          {error && <p className="text-red-500 text-center">{error}</p>} {}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {}
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={eventData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black"
              />
              {}
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={eventData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 text-black"
              />
              {}
              <input
                type="datetime-local"
                name="date"
                value={eventData.date?.slice(0, 16) || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 text-black"
              />
              {}
              <input
                type="number"
                name="price"
                placeholder="Price in euros"
                value={eventData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 text-black"
              />
              {}
              <input
                type="text"
                name="contacts"
                placeholder="Contact information"
                value={eventData.contacts}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 text-black"
              />
              {}
              <input
                type="text"
                name="link"
                placeholder="External link or social"
                value={eventData.link}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 text-black"
              />
            </motion.div>

            <div>
              <p className="mb-2 font-medium">Select category:</p>
              <div className="flex flex-wrap gap-2">
                {}
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)} 
                    className={`px-4 py-2 rounded-full border transition ${
                      eventData.category === cat
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {}
            <textarea
              name="description"
              placeholder="Description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black"
              rows={4}
            />

            {}
            <motion.button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-opacity-90 transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </form>
        </motion.div>
      </main>

      <Footer /> {}
    </div>
  );
};

export default EditEventPage;
