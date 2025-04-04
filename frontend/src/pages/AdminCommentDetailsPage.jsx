import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const AdminCommentDetailsPage = () => {
  const { id } = useParams();      
  const navigate = useNavigate();      
  const [comment, setComment] = useState(null); 
  const [error, setError] = useState('');       

  useEffect(() => {
    
    axios.get(`/api/admin/comment/${id}`)
      .then(res => setComment(res.data))
      .catch(() => setError('Failed to load comment.'));
  }, [id]);

  const handleDelete = async () => {
    
    if (window.confirm('Are you sure you want to delete this comment and notify the user?')) {
      try {
        
        await axios.delete(`/api/admin/comment/${id}`);
        alert('Comment deleted and user notified.');
        navigate('/admin'); 
      } catch {
        alert('Failed to delete comment.');
      }
    }
  };

  
  if (!comment) return <div className="p-6 text-white">Loading... {error}</div>;

  
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Comment Details</h1>
      <p><strong>From:</strong> {comment.author} ({comment.author_email})</p>
      <p><strong>To:</strong> {comment.target_username}</p>
      <p><strong>Created:</strong> {new Date(comment.created_at).toLocaleString()}</p>
      <p className="my-4"><strong>Comment:</strong> {comment.comment}</p>
      <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
        Delete & Notify
      </button>
    </div>
  );
};

export default AdminCommentDetailsPage;
