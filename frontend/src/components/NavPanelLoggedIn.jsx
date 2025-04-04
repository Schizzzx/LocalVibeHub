import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const NavPanelLoggedIn = ({ username }) => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);       
  const [unreadCount, setUnreadCount] = useState(0);             
  const [unreadMessages, setUnreadMessages] = useState(0);       // не работает - исправь ( в чатроутс надо добавить что то скорее всего)
                                                                  // doesn't work if the russian comment still there ^ 
                                                                  // GET http://localhost:5000/api/chat/unread-count error 404

  
  const handleSearch = () => navigate('/search');
  const handleCreate = () => navigate('/create');
  const handleProfile = () => navigate('/profile');
  const handleAttending = () => navigate('/registered-events');
  const handleHosted = () => navigate('/my-events');
  const handleFAQ = () => navigate('/faq');
  const handleSupport = () => navigate('/support');
  const handleFavorites = () => navigate('/favorites');
  const handleSubscriptions = () => navigate('/subscriptions');
  const handleCalendar = () => navigate('/calendar');
  const handleNotifications = () => navigate('/notifications');
  const handleChat = () => navigate('/chat');

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error('Error fetching unread notifications:', err);
      }

      try {
        const res = await fetch('http://localhost:5000/api/chat/unread-count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUnreadMessages(data.count ?? 0);
      } catch (err) {
        console.error('Error fetching unread messages:', err);
      }
    };

    fetchUnread();
  }, []);

  return (
    <nav className="w-full bg-panel text-text py-4 px-6 flex items-center justify-between shadow-md relative">
      {}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/main')}
          className="text-2xl font-bold no-underline hover:no-underline"
        >
          LocalVibe HUB
        </button>
        <div className="w-[3px] h-8 bg-white opacity-40 rounded" />
      </div>

      {}
      <div className="flex gap-6 items-center">
        {}
        <div className="flex gap-2 items-center">
          <button onClick={handleAttending} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Attending</button>
          <button onClick={handleHosted} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Hosted</button>
        </div>

        <div className="w-px h-6 bg-white opacity-30 mx-2" />

        {}
        <div className="flex gap-2 items-center">
          <button onClick={handleSearch} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Search</button>
          <button onClick={handleCreate} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Create</button>
        </div>

        <div className="w-px h-6 bg-white opacity-30 mx-2" />

        {}
        <div className="flex gap-2 items-center">
          <button onClick={handleFavorites} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Favorites</button>
          <button onClick={handleSubscriptions} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Subscriptions</button>
        </div>

        <div className="w-px h-6 bg-white opacity-30 mx-2" />

        {}
        <div className="flex gap-2 items-center">
          <button onClick={handleFAQ} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">FAQ</button>
          <button onClick={handleSupport} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Support</button>
        </div>

        <div className="w-px h-6 bg-white opacity-30 mx-2" />

        {}
        <div className="flex gap-2 items-center">
          <button onClick={handleCalendar} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">Calendar</button>
          <button onClick={handleNotifications} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80 relative">
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="w-px h-6 bg-white opacity-30 mx-2" />

        {}
        <div className="flex gap-2 items-center">
          <button onClick={handleChat} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80 relative">
            Chat
            <span className={`absolute -top-2 -right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full ${
              unreadMessages > 0 ? 'bg-red-600' : 'bg-gray-500'
            }`}>
              {unreadMessages}
            </span>
          </button>
        </div>

        <div className="w-px h-6 bg-white opacity-30 mx-2" />

        {}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-accent text-text-on-light px-4 py-2 rounded-xl hover:bg-opacity-80">
            {username || 'User'}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              <button onClick={handleProfile} className="block w-full px-4 py-2 text-left hover:bg-gray-200 no-underline">Go to profile</button>
              <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-200 no-underline">Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavPanelLoggedIn;
