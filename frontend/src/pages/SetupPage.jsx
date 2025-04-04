import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SetupPage = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    username: '', 
    city: 'Riga', 
    age: '', 
  });

  
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [message, setMessage] = useState(''); 

  
  const interestsList = [
    'Concerts', 'Excursions', 'Board Games', 'Workshops',
    'Art', 'Tech', 'Parties', 'Networking',
  ];

  
  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest) 
        : [...prev, interest] 
    );
  };

  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, 
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(''); 

    const token = localStorage.getItem('accessToken') || window.accessToken;
    if (!token) return setMessage('Unauthorized'); 

    
    const payload = {
      username: formData.username.trim(), 
      city: formData.city, 
      age: parseInt(formData.age), 
      interests: selectedInterests, 
    };

    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/setup-profile',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setMessage('Profile setup completed!'); 
      setTimeout(() => {
        navigate('/main'); 
      }, 1000);
    } catch (error) {
      console.error('Setup error:', error);
      setMessage(error.response?.data?.error || 'Something went wrong'); 
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Navbar /> {}

      <div className="flex flex-grow items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-panel text-white p-6 rounded-xl w-full max-w-6xl flex flex-col md:flex-row gap-6 shadow-xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 pl-4"
          >
            <h2 className="text-xl font-bold mb-4">Dear user,</h2>
            <p>
              Welcome to LocalVibe Hub. Let us finish setting up your account
              so we can better recommend events to you based on your location
              and interests.
            </p>
            <p className="mt-4">
              On the right side of the page, please provide your details.
              This will help us make your user experience better and easier.
              Your details will remain confidential.
            </p>
            <p className="mt-4 text-yellow-300 font-medium">
              Note: Only Riga is available at this stage. Adding multiple cities requires changes in
              event creation filters, typo tolerance, and recommendation logic.
            </p>
          </motion.div>

          {}
          <motion.form
            onSubmit={handleSubmit} 
            className="flex-1 flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <input
              type="text"
              name="username"
              placeholder="Your Name and Surname"
              value={formData.username} 
              onChange={handleChange} 
              required
              className="px-4 py-2 rounded bg-white text-black"
            />

            <select
              name="city"
              value={formData.city} 
              onChange={handleChange}
              required
              className="px-4 py-2 rounded bg-white text-black"
            >
              <option value="Riga">Riga</option>
            </select>

            <input
              type="number"
              name="age"
              placeholder="Your age"
              value={formData.age} 
              onChange={handleChange} 
              required
              className="px-4 py-2 rounded bg-white text-black"
              min="0"
            />

            {}
            <div>
              <label className="block mb-1">Enter your interests:</label>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((interest) => (
                  <motion.button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)} 
                    className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                      selectedInterests.includes(interest)
                        ? 'bg-accent text-black'
                        : 'bg-gray-700 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>

            {}
            <motion.button
              type="submit"
              className="bg-accent text-black px-4 py-2 rounded-xl mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter
            </motion.button>

            {}
            {message && (
              <p className="text-sm mt-2 text-center text-white">
                {message}
              </p>
            )}
          </motion.form>
        </motion.div>
      </div>

      <Footer /> {}
    </div>
  );
};

export default SetupPage;
