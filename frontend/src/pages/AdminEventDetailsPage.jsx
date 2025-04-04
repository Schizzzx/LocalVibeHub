import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const AdminEventDetailsPage = () => {
  const { id } = useParams();                    
  const navigate = useNavigate();               
  const [event, setEvent] = useState(null);     
  const [error, setError] = useState('');       

  useEffect(() => {
    
    axios.get(`/api/admin/event/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setError('Failed to load event.'));
  }, [id]);

  const handleDelete = async () => {
    
    if (window.confirm('Are you sure you want to delete this event and notify the organizer?')) {
      try {
        await axios.delete(`/api/admin/event/${id}`);
        alert('Event deleted and organizer notified.');
        navigate('/admin'); 
      } catch {
        alert('Failed to delete event.');
      }
    }
  };

  if (!event) {
    
    return <div className="p-6 text-white">Loading... {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>

      {}
      <p><strong>Title:</strong> {event.title}</p>
      <p><strong>Organizer:</strong> {event.organizer_username} ({event.organizer_email})</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p className="my-4"><strong>Description:</strong> {event.description}</p>

      {}
      <button
        onClick={handleDelete}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Delete & Notify
      </button>
    </div>
  );
};

export default AdminEventDetailsPage;
