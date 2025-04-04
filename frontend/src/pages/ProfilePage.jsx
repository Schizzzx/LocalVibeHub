import React, { useEffect, useState } from 'react';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken') || window.accessToken;
        if (!token) return window.location.href = '/?expired=1';

        
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);

        
        const ratingRes = await axios.get(`/api/comments/${res.data.user.id}/rating`);
        setAverageRating(ratingRes.data.rating);

        
        const commentsRes = await axios.get(`/api/comments/${res.data.user.id}`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Failed to load profile or comments:', err);
        localStorage.removeItem('accessToken');
        window.location.href = '/?expired=1';
      }
    };

    fetchProfile();
  }, []);

  
  const handleReportComment = async (commentId) => {
    const reason = prompt('Please describe the issue with this comment:');
    if (!reason || !reason.trim()) return;

    try {
      const token = localStorage.getItem('accessToken') || window.accessToken;

      await axios.post('/api/reports', {
        report_type: 'comment',
        target_id: commentId,
        reason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Thank you. The comment has been reported.');
    } catch (err) {
      console.error('Report failed:', err);
      alert('Failed to submit report.');
    }
  };

  
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col">
        <NavPanelLoggedIn username="User" />
        <main className="flex-grow flex items-center justify-center text-xl">Loading profile...</main>
        <Footer />
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-background text-text flex flex-col overflow-hidden">
      <NavPanelLoggedIn username={user.username} /> {}

      <main className="flex-grow flex justify-center items-center px-6 py-8">
        <motion.div
          className="bg-panel p-6 rounded-3xl w-full max-w-5xl shadow-xl flex flex-col justify-between h-[68vh]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-center mb-4">Your Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-base mb-1"><strong>Name:</strong> {user.username}</p>
                <p className="text-base mb-1"><strong>City:</strong> {user.city}</p>
                <p className="text-base mb-1"><strong>Age:</strong> {user.age} years old</p>
                <p className="text-base mb-1">
                  <strong>Average Rating:</strong>{' '}
                  {averageRating !== null && !isNaN(averageRating)
                    ? `${parseFloat(averageRating).toFixed(1)} ★`
                    : 'No ratings yet'}
                </p>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="mt-4 bg-accent text-black px-4 py-2 rounded-xl text-sm hover:bg-opacity-80"
                >
                  Change your profile
                </button>
              </motion.div>

              {}
              <motion.div
                className="text-sm text-gray-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>
                  LocalVibe Hub helps enhance your social experience based on your location and interests.
                  Keep your details up to date for better recommendations.
                </p>
                <p className="mt-3">
                  I didn’t know how to fill this space, so here’s a wish: calm lectures and warm coffee!
                </p>
              </motion.div>
            </div>

            {}
            {comments.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2 text-center">What people say about you</h2>
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto px-1 pr-2">
                  <AnimatePresence initial={false}>
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        className="bg-background-light text-white px-3 py-2 rounded-2xl shadow border border-gray-700 text-xs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p><strong>Rating:</strong> {comment.rating} ★</p>
                        <p className="italic mb-1">"{comment.comment}"</p>
                        <p className="text-gray-400">
                          by {comment.author} on {new Date(comment.created_at).toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleReportComment(comment.id)}
                          className="text-red-400 underline text-xs mt-1 hover:text-red-500"
                        >
                          Report this comment
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Random link (Rickroll) */}
          <motion.div
            className="text-xs text-center text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-opacity-70"
            >
              Click here if you’re curious
            </a>
          </motion.div>
        </motion.div>
      </main>

      <Footer /> {/* Footer component */}
    </div>
  );
};

export default ProfilePage;
