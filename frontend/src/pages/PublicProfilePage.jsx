import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const PublicProfilePage = () => {
  
  const { id } = useParams();
  
  
  const [userInfo, setUserInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [username, setUsername] = useState('User');
  const [message, setMessage] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [ownUserId, setOwnUserId] = useState(null);

  
  const token = localStorage.getItem('accessToken') || window.accessToken;

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return window.location.href = '/?expired=1'; 

        
        const profileRes = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(profileRes.data.user.username); 
        setOwnUserId(profileRes.data.user.id); 

        
        const userRes = await axios.get(`/api/users/${id}/public-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(userRes.data.user);
        setEvents(userRes.data.pastEvents);
        setComments(userRes.data.comments);
        setAverageRating(userRes.data.rating);

        
        const subRes = await axios.get(`/api/subscriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSubscribed(subRes.data.subscribed);
      } catch (error) {
        console.error('Failed to load public profile:', error);
        setMessage('Failed to load user data.');
      }
    };

    fetchData();
  }, [id]);

  
  const handleSubscriptionToggle = async () => {
    try {
      if (isSubscribed) {
        await axios.delete(`/api/subscriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`/api/subscriptions/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsSubscribed(!isSubscribed); 
    } catch (err) {
      console.error('Subscription error:', err);
      setMessage('Failed to update subscription.');
    }
  };

  
  const handleSubmitComment = async () => {
    try {
      if (!newComment.trim()) return;

      
      await axios.post(`/api/comments/${id}`, {
        comment: newComment,
        rating,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewComment('');
      setRating(5); 
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to submit comment:', err);
      setMessage('Error while submitting comment.');
    }
  };

  // stole from the random tik tok video. I lost it, sorry
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          xmlns="http://www.w3.org/2000/svg"
          fill={(hoverRating || rating) >= i ? 'white' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-7 h-7 cursor-pointer transition-transform transform hover:scale-110"
        > 
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.5l2.35 4.76 5.27.77-3.8 3.7.9 5.26-4.72-2.48-4.72 2.48.9-5.26-3.8-3.7 5.27-.77L11.48 3.5z"
          />
        </svg>
      );
    }
    return <div className="flex justify-center gap-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text overflow-hidden">
      <NavPanelLoggedIn username={username} />

      <main className="flex-grow flex justify-center items-center p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-panel p-4 rounded-xl shadow-lg flex flex-col h-[75vh]"
        >
          {userInfo ? (
            <>
              {}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-2"
              >
                <h1 className="text-xl font-bold truncate">{userInfo.username}'s Public Profile</h1>
                <p className="text-sm"><strong>City:</strong> {userInfo.city}</p>
                <p className="text-xl font-bold mt-1">
                  Average Rating:{' '}
                  {typeof averageRating === 'number'
                    ? `${averageRating.toFixed(1)} ☆`
                    : 'No ratings yet'}
                </p>

                <div className="flex justify-center gap-2 mt-2">
                  <button
                    onClick={handleSubscriptionToggle}
                    className={`px-4 py-1 rounded-xl text-sm ${
                      isSubscribed ? 'bg-gray-500 text-white' : 'bg-accent text-black'
                    }`}
                  >
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                  </button>

                  {ownUserId && userInfo.id !== ownUserId && (
                    <button
                      onClick={() => {
                        localStorage.setItem('chatWith', userInfo.id);
                        window.location.href = '/chat';
                      }}
                      className="px-4 py-1 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-500"
                    >
                      Send Message
                    </button>
                  )}
                </div>
              </motion.div>

              {}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-1 gap-4 overflow-hidden mt-2"
              >
                <div className="w-1/2 bg-gray-800 rounded-xl p-3 overflow-y-auto max-h-[290px]">
                  <h2 className="text-lg font-semibold mb-2 text-center">Events by user</h2>
                  {events.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {events.map((e) => (
                        <li key={e.id} className="bg-gray-700 p-2 rounded">
                          <strong>{e.title}</strong> – {e.date}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-center">No events yet.</p>
                  )}
                </div>

                {}
                <div className="w-1/2 bg-gray-800 rounded-xl p-3 overflow-y-auto max-h-[290px]">
                  <h2 className="text-lg font-semibold mb-2 text-center">Reviews</h2>
                  {comments.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {comments.map((c) => (
                        <li key={c.id} className="border border-gray-700 rounded p-2 bg-gray-900">
                          <p><strong>Rating:</strong> {c.rating} ☆</p>
                          <p>{c.comment}</p>
                          <p className="text-xs text-gray-400">
                            By user #{c.user_id} on {new Date(c.created_at).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-center">No reviews yet.</p>
                  )}
                </div>
              </motion.div>

              {}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-3 pt-2 border-t border-gray-700 text-sm"
              >
                <h2 className="text-lg font-semibold mb-2 text-center">Leave a Review</h2>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-1 rounded bg-white text-black mb-2 text-sm resize-none"
                  placeholder="Leave a comment"
                  rows={2}
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm">Select rating:</span>
                  {renderStars()}
                  <button
                    onClick={handleSubmitComment}
                    className="mt-2 bg-accent text-black px-4 py-1 rounded text-sm"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>

              {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
            </>
          ) : (
            <p className="text-center">Loading profile...</p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicProfilePage;
