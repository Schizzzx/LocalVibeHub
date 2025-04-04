import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const AdminSupportDetailsPage = () => {
  const { id } = useParams();                      
  const navigate = useNavigate();                  
  const [message, setMessage] = useState(null);    
  const [reply, setReply] = useState('');          
  const [error, setError] = useState('');          

  useEffect(() => {
    
    axios.get(`/api/support/${id}`)
      .then(res => setMessage(res.data))
      .catch(() => setError('Failed to load support message.'));
  }, [id]);

  const handleReply = async () => {
    
    if (!reply.trim()) {
      return alert('Reply cannot be empty.');
    }

    try {
      
      await axios.post(`/api/admin-support/reply/${id}`, { message: reply });
      alert('Reply sent and user notified.');
      navigate('/admin'); 
    } catch {
      alert('Failed to send reply.');
    }
  };

  
  if (!message) return <div className="p-6 text-white">Loading... {error}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Support Message</h1>

      {}
      <p><strong>From:</strong> {message.email}</p>
      <p><strong>Subject:</strong> {message.subject}</p>
      <p className="my-4"><strong>Message:</strong> {message.message}</p>

      { }
      <textarea
        className="w-full bg-gray-900 text-white p-2 rounded mt-4"
        rows="4"
        placeholder="Enter your reply here..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />

      {}
      <button
        onClick={handleReply}
        className="bg-blue-600 px-4 py-2 rounded mt-2 hover:bg-blue-700 transition"
      >
        Send Reply
      </button>
    </div>
  );
};

export default AdminSupportDetailsPage;
