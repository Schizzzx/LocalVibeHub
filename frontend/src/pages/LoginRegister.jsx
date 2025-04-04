import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LoginRegister = () => {
  const navigate = useNavigate(); 
  const [mode, setMode] = useState('login'); 
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
  });
  const [message, setMessage] = useState(''); 

  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, 
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(''); 

    
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.'); 
      return;
    }

    const endpoint = mode === 'login' 
      ? '/api/users/login'
      : '/api/users/register';

    try {
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password } 
        : { username: formData.username, email: formData.email, password: formData.password }; 

      const response = await axios.post(endpoint, payload); 
      const { accessToken } = response.data; 

      window.accessToken = accessToken; 
      setTimeout(() => {
        localStorage.setItem('accessToken', accessToken); 
        console.log('TOKEN SAVED TO LOCALSTORAGE'); 
      }, 0);

      
      setTimeout(async () => {
        try {
          const meRes = await axios.get('/api/users/me'); 
          const role = meRes.data.role; 

          
          if (role === 1) {
            navigate('/admin'); 
          } else if (mode === 'login') {
            navigate('/main'); 
          } else {
            navigate('/setup'); 
          }
        } catch (meErr) {
          console.error('Failed to fetch user role after login:', meErr); 
          setMessage('Something went wrong. Try again.'); 
        }
      }, 100);

      setMessage(response.data.message || 'Success!'); 
    } catch (error) {
      console.error('Login/Register error:', error); 
      setMessage(error.response?.data?.error || 'Error. Try again.'); 
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Navbar /> {}

      <div className="flex-grow flex flex-col items-center justify-center">
        <motion.h1
          className="text-2xl font-bold bg-panel px-6 py-2 rounded-full mb-8"
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }} 
        >
          Registrational Page
        </motion.h1>

        <motion.div
          className="bg-panel p-8 rounded-[90px] w-full max-w-md shadow-md"
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.4 }} 
        >
          {}
          <div className="flex justify-around mb-6">
            <motion.button
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded-xl ${
                mode === 'register'
                  ? 'bg-accent text-black'
                  : 'bg-gray-700 text-white'
              }`}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-xl ${
                mode === 'login'
                  ? 'bg-accent text-black'
                  : 'bg-gray-700 text-white'
              }`}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Log In
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {}
              {mode === 'register' && (
                <motion.input
                  key="username"
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="px-4 py-2 rounded bg-white text-black"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                  transition={{ duration: 0.2 }} 
                />
              )}
            </AnimatePresence>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-2 rounded bg-white text-black"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-4 py-2 rounded bg-white text-black"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <AnimatePresence mode="wait">
              {}
              {mode === 'register' && (
                <motion.input
                  key="confirm"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat Password"
                  className="px-4 py-2 rounded bg-white text-black"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                  transition={{ duration: 0.2 }} 
                />
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="bg-accent text-black px-4 py-2 rounded-xl mt-4"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              transition={{ duration: 0.2 }} 
            >
              Enter
            </motion.button>

            {message && (
              <motion.div
                className="text-sm mt-4 text-center text-white"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }} 
              >
                {message} {}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
      <Footer /> {}
    </div>
  );
};

export default LoginRegister;
