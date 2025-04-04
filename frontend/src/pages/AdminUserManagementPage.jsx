import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AdminUserManagementPage = () => {
  const [reportedUsers, setReportedUsers] = useState([]); 
  const [bannedUsers, setBannedUsers] = useState([]);    
  const navigate = useNavigate();

  
  const fetchUsers = async () => {
    try {
      const [reportedRes, bannedRes] = await Promise.all([
        axios.get('/api/admin/users/reported'),
        axios.get('/api/admin/users/banned')
      ]);
      setReportedUsers(reportedRes.data);
      setBannedUsers(bannedRes.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  
  const handleBan = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    try {
      await axios.post(`/api/admin/users/ban/${userId}`);
      fetchUsers(); 
    } catch {
      alert('Failed to ban user.');
    }
  };

  
  const handleUnban = async (userId) => {
    if (!window.confirm('Are you sure you want to unban this user?')) return;
    try {
      await axios.post(`/api/admin/users/unban/${userId}`);
      fetchUsers(); 
    } catch {
      alert('Failed to unban user.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {}
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Reported Users</h2>
          {reportedUsers.length === 0 ? (
            <p>No reported users.</p>
          ) : (
            reportedUsers.map((user) => (
              <div
                key={user.userId}
                className="flex justify-between items-center border-b border-gray-700 py-2"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-400">Reports: {user.report_count}</p>
                </div>
                <button
                  onClick={() => handleBan(user.userId)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Ban
                </button>
              </div>
            ))
          )}
        </div>

        {}
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Banned Users</h2>
          {bannedUsers.length === 0 ? (
            <p>No banned users.</p>
          ) : (
            bannedUsers.map((user) => (
              <div
                key={user.userId}
                className="flex justify-between items-center border-b border-gray-700 py-2"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-400">
                    Banned at: {new Date(user.blocked_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleUnban(user.userId)}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  Unban
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
