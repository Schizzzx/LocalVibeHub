import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);          
  const [username, setUsername] = useState('User');   
  const calendarRef = useRef();                       
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/?expired=1'); 

      try {
        
        const profileRes = await axios.get('/api/users/profile');
        setUsername(profileRes.data.user.username);

        
        const res = await axios.get('/api/events/registered');

        
        const formatted = res.data.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date.split('T')[0],
        }));

        setEvents(formatted);
      } catch (err) {
        console.error('Failed to load registered events:', err);
      }
    };

    fetchEvents();
  }, [navigate]);

  
  const handleEventClick = (info) => {
    const eventId = info.event.id;
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text overflow-hidden">
      {}
      <NavPanelLoggedIn username={username} />

      <main className="flex-grow px-6 py-10">
        <motion.div
          className="bg-panel p-6 rounded-3xl shadow-xl max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {}
          <motion.h1
            className="text-2xl font-bold text-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Event Calendar
          </motion.h1>

          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              height="auto"
              displayEventTime={false}
              eventColor="#F97316"
            />
          </motion.div>
        </motion.div>
      </main>

      {}
      <Footer />
    </div>
  );
};

export default CalendarPage;
