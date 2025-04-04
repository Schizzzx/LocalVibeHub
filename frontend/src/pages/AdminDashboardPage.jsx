import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const AdminDashboardPage = () => {
  const [reportedComments, setReportedComments] = useState([]);      
  const [reportedEvents, setReportedEvents] = useState([]);          
  const [supportMessages, setSupportMessages] = useState([]);        
  const [reportedUsers, setReportedUsers] = useState([]);            
  const navigate = useNavigate();                                    

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const [commentsRes, eventsRes, supportRes, usersRes] = await Promise.all([
          axios.get('/api/reports/comments'),
          axios.get('/api/reports/events'),
          axios.get('/api/admin-support/all'),
          axios.get('/api/admin/users/reported')
        ]);
        setReportedComments(commentsRes.data);
        setReportedEvents(eventsRes.data);
        setSupportMessages(supportRes.data);
        setReportedUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to load admin data', err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const openDetails = (type, id) => {
    navigate(`/admin/${type}/${id}`); 
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {}
      <nav className="w-full flex justify-end p-4 bg-gray-900 shadow-md">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {}
      <main className="flex-grow overflow-y-auto p-6 flex justify-center items-start">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Reported Comments</h2>
            {reportedComments.length === 0 ? (
              <p className="text-gray-400">No reports.</p>
            ) : (
              reportedComments.map((c) => (
                <div
                  key={c.target_id}
                  className="border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 rounded"
                  onClick={() => openDetails('comment', c.target_id)}
                >
                  <p className="text-sm">From <b>{c.author}</b>: {c.comment.slice(0, 50)}...</p>
                  <p className="text-xs text-gray-400">Reports: {c.report_count}</p>
                </div>
              ))
            )}
          </div>

          {}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Reported Events</h2>
            {reportedEvents.length === 0 ? (
              <p className="text-gray-400">No reports.</p>
            ) : (
              reportedEvents.map((e) => (
                <div
                  key={e.target_id}
                  className="border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 rounded"
                  onClick={() => openDetails('event', e.target_id)}
                >
                  <p className="text-sm">Event: <b>{e.title}</b></p>
                  <p className="text-xs text-gray-400">Reports: {e.report_count}</p>
                </div>
              ))
            )}
          </div>

          {}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Support Messages</h2>
            {supportMessages.length === 0 ? (
              <p className="text-gray-400">No messages.</p>
            ) : (
              supportMessages.map((s) => (
                <div
                  key={s.id}
                  className="border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 rounded"
                  onClick={() => openDetails('support', s.id)}
                >
                  <p className="text-sm">From <b>{s.email}</b>: {s.subject}</p>
                  <p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Reported Users</h2>
            {reportedUsers.length === 0 ? (
              <p className="text-gray-400">No users reported.</p>
            ) : (
              reportedUsers.map((u) => (
                <div
                  key={u.userId}
                  className="border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 rounded"
                  onClick={() => openDetails('user', u.userId)}
                >
                  <p className="text-sm"><b>{u.username}</b></p>
                  <p className="text-xs text-gray-400">Reports: {u.report_count}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
