import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const AdminUserDetailsPage = () => {
  const { id } = useParams();                      
  const [data, setData] = useState(null);          
  const [isBanned, setIsBanned] = useState(false); 
  const [error, setError] = useState('');          

  useEffect(() => {
    
    axios.get(`/api/admin/user/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Failed to load user details:', err);
        setError('Failed to load user details.');
      });
  }, [id]);

  const handleBan = async () => {
    
    try {
      await axios.post(`/api/admin/users/ban/${id}`);
      setIsBanned(true);
      alert('User has been banned and notified.');
    } catch {
      alert('Failed to ban user.');
    }
  };

  const handleUnban = async () => {
    
    try {
      await axios.post(`/api/admin/users/unban/${id}`);
      setIsBanned(false);
      alert('User has been unbanned.');
    } catch {
      alert('Failed to unban user.');
    }
  };

  if (!data) return <div className="p-6 text-white">Loading... {error}</div>;

  
  const { user, average_rating, comments, events } = data;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      {}
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Registered:</strong> {new Date(user.created_at).toLocaleString()}</p>

      {}
      <p><strong>Rating:</strong> {
        typeof average_rating === 'number'
            ? average_rating.toFixed(1)
            : average_rating && !isNaN(Number(average_rating))
                ? Number(average_rating).toFixed(1)
                : 'N/A'
      }</p>

      {}
      <p><strong>Status:</strong> {isBanned ? 'Banned' : 'Active'}</p>

      {}
      <div className="mt-4">
        {isBanned ? (
          <button onClick={handleUnban} className="bg-green-600 px-4 py-2 rounded">
            Unban User
          </button>
        ) : (
          <button onClick={handleBan} className="bg-red-600 px-4 py-2 rounded">
            Ban User
          </button>
        )}
      </div>

      {}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {comments.map((c) => (
              <li key={c.id}>
                <b>{c.rating}/5</b> — {c.comment}
              </li>
            ))}
          </ul>
        )}
      </div>

      {}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-400">No events created.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {events.map((e) => (
              <li key={e.id}>
                <b>{e.title}</b> — {new Date(e.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
