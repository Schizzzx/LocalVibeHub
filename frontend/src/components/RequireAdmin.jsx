import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';


const RequireAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);     
  const [isAdmin, setIsAdmin] = useState(false);    

  useEffect(() => {
    const checkRole = async () => {
      try {
        
        const res = await axios.get('/api/users/me');
        if (res.data.role === 1) {
          setIsAdmin(true); 
        }
      } catch (err) {
        console.warn('Access denied or not authenticated'); 
      } finally {
        setLoading(false); 
      }
    };

    checkRole();
  }, []);

  
  if (loading) return <div className="text-center p-10">Checking access...</div>;

  
  if (!isAdmin) return <Navigate to="/" replace />;

  
  return children;
};

export default RequireAdmin;
