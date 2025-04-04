import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

 
  const isAuthenticated = false;

  
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/main');
    } else {
      navigate('/');
    }
  };

  
  const handleRedirectToLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="w-full bg-panel text-text py-4 px-6 flex items-center justify-between shadow-md">
      
      {}
      <button
        onClick={handleLogoClick}
        className="text-2xl font-bold"
        style={{ textDecoration: 'none' }}
      >
        LocalVibe HUB
      </button>

      {}
      {}
      <div className="flex gap-4">

        {}
        <button
          onClick={handleRedirectToLogin}
          className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80"
        >
          Search for events 
        </button>

        {}
        <button
          onClick={handleRedirectToLogin}
          className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80"
        >
          Create an event 
        </button>

        {}
        <button
          onClick={handleRedirectToLogin}
          className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80"
        >
          Log in / Sign in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
