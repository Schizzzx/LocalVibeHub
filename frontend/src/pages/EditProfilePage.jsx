import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';


const interestOptions = [
  'Concerts', 'Excursions', 'Board Games', 'Workshops',
  'Art', 'Tech', 'Parties', 'Networking'
];

const EditProfilePage = () => {
  
  const [formData, setFormData] = useState({
    username: '',
    city: '',
    age: '',
    email: '',
    password: ''
  });

  const [selectedInterests, setSelectedInterests] = useState([]); 
  const [username, setUsername] = useState('User'); 
  const [message, setMessage] = useState(''); 

  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('/api/users/profile'); 
        const user = res.data.user;

        setUsername(user.username); 
        setFormData({
          username: user.username || '',
          city: user.city || '',
          age: user.age || '',
          email: user.email || '',
          password: ''
        });

        const interestsRes = await axios.get('/api/users/interests'); 
        setSelectedInterests(interestsRes.data || []); 
      } catch (err) {
        console.error('Error loading profile:', err); 
      }
    };

    fetchUserProfile(); 
  }, []); 

  
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
      [e.target.name]: e.target.value 
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(''); 

    try {
      
      await axios.put('/api/users/profile', {
        ...formData,
        interests: selectedInterests
      });

      setMessage('Profile updated successfully.'); 
    } catch (err) {
      console.error('Update error:', err); 
      setMessage('Failed to update profile.'); 
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavPanelLoggedIn username={username} /> {}

      <main className="flex-grow px-6 py-10">
        <motion.div
          className="bg-panel p-6 rounded-xl max-w-5xl mx-auto shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl font-bold text-center mb-6">Change your profile</h1> {}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              {}
              <input
                type="text"
                name="username"
                placeholder="Your Name and Surname"
                value={formData.username}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-full bg-white text-black"
              />
              {}
              <input
                type="text"
                name="city"
                placeholder="Your City of Living"
                value={formData.city}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-full bg-white text-black"
              />
              {}
              <input
                type="number"
                name="age"
                placeholder="Your Age"
                value={formData.age}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-full bg-white text-black"
              />
              {}
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-full bg-white text-black"
              />
              {}
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 rounded-full bg-white text-black"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label>Your List of interests:</label> {}
              <div className="flex flex-wrap gap-2">
                {}
                {interestOptions.map((interest) => (
                  <motion.button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)} 
                    className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                      selectedInterests.includes(interest)
                        ? 'bg-accent text-black'
                        : 'bg-gray-700 text-white'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {interest} {}
                  </motion.button>
                ))}
              </div>

              {}
              <button type="submit" className="mt-6 bg-accent text-black px-6 py-2 rounded-full">
                Save Changes
              </button>

              {message && (
                <p className="text-center text-sm mt-2 text-white">{message}</p> 
              )}
            </div>
          </form>
        </motion.div>
      </main>

      <Footer /> {}
    </div>
  );
};

export default EditProfilePage;
