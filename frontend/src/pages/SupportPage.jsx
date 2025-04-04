import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const SupportPage = () => {
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setResponse(''); 

    
    const token = localStorage.getItem('accessToken') || window.accessToken;

    
    if (!token) return setResponse('Unauthorized');

    try {
      
      const res = await axios.post('http://localhost:5000/api/support', {
        subject,
        message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      setResponse(res.data.message);
      setSubject(''); 
      setMessage(''); 
    } catch (err) {
      
      setResponse(err.response?.data?.error || 'Failed to send support message.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {}
      <NavPanelLoggedIn username="User" />

      <main className="flex-grow px-8 py-10 flex justify-center items-start">
        {}
        <motion.div
          className="bg-panel p-6 rounded-xl shadow-xl w-full max-w-xl"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
        >
          <h1 className="text-2xl font-bold mb-4">Support</h1> {}

          {}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {}
            <motion.input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Subject"
              required
              className="px-4 py-2 rounded bg-white text-black"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }} 
            />
            {}
            <motion.textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Your message"
              required
              rows={5}
              className="px-4 py-2 rounded bg-white text-black"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }} 
            />
            {}
            <motion.button
              type="submit"
              className="bg-accent text-black px-4 py-2 rounded-xl"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
            >
              Send Message
            </motion.button>

            {}
            {response && <p className="text-sm text-white mt-2">{response}</p>}
          </form>
        </motion.div>
      </main>

      {}
      <Footer />
    </div>
  );
};

export default SupportPage;
