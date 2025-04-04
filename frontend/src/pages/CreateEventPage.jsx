import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';


const categoryOptions = [
  'Concerts', 'Excursions', 'Board Games', 'Workshops',
  'Art', 'Tech', 'Parties', 'Networking'
];

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('User');

  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    age_restriction: '',
    price: '',
    description: '',
    image_url: '',
    contacts: '',
    link: '',
    max_participants: 100, 
  });

  
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return navigate('/?expired=1');

        const res = await axios.get('/api/users/profile');
        setUsername(res.data.user.username);
      } catch (err) {
        console.error('Error fetching username:', err);
      }
    };
    fetchUsername();
  }, [navigate]);

  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('accessToken');
    if (!token) return setMessage('Unauthorized');

    const payload = {
      ...formData,
      location: `Riga, ${formData.location}`, 
      category,
    };

    try {
      await axios.post('/api/events/create', payload);
      setMessage('Event created successfully!');
      setTimeout(() => navigate('/main'), 1000); 
    } catch (error) {
      console.error('Create event error:', error);
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} />

      <main className="flex-grow flex justify-center items-center px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="bg-panel p-8 rounded-xl w-full max-w-5xl shadow-xl"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Create your event</h1>

          {}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {}
            <div className="flex flex-col gap-4">
              <motion.input
                type="text"
                name="title"
                placeholder="The event name"
                value={formData.title}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />

              <motion.div className="flex flex-col">
                <input
                  type="text"
                  name="location"
                  placeholder="Address in Riga (e.g. Janis Zuters Street 5)"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 rounded bg-white text-black"
                />
                <p className="text-xs text-gray-400 mt-1">
                  All events are assumed to take place in <strong>Riga</strong> by default.
                </p>
              </motion.div>

              <motion.input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />

              <motion.input
                type="number"
                name="age_restriction"
                placeholder="Age restriction"
                value={formData.age_restriction}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />

              <motion.input
                type="number"
                name="price"
                placeholder="Price in euro"
                value={formData.price}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />

              <motion.input
                type="text"
                name="image_url"
                placeholder="Image URL (optional)"
                value={formData.image_url}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {}
            <div className="flex flex-col gap-4">
              <motion.textarea
                name="description"
                placeholder="Add description to your event"
                value={formData.description}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-white text-black h-32"
                required
                whileFocus={{ scale: 1.01 }}
              />

              <motion.input
                type="text"
                name="contacts"
                placeholder="Contacts (e.g. email, phone...)"
                value={formData.contacts}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />

              <motion.input
                type="text"
                name="link"
                placeholder="Social link (Facebook, Instagram...)"
                value={formData.link}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-white text-black"
                whileFocus={{ scale: 1.02 }}
              />

              {}
              <div>
                <label className="block mb-2">Choose a category:</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => (
                    <motion.button
                      type="button"
                      key={option}
                      onClick={() => setCategory(option)}
                      className={`px-4 py-2 rounded-xl ${
                        category === option
                          ? 'bg-accent text-black'
                          : 'bg-gray-700 text-white'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>

              {}
              <motion.button
                type="submit"
                className="mt-6 bg-accent text-black px-6 py-3 rounded-xl"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
              >
                Enter
              </motion.button>

              {}
              {message && (
                <p className="text-sm mt-2 text-center text-white">{message}</p>
              )}
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEventPage;
