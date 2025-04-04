import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Welcome from './pages/Welcome';
import LoginRegister from './pages/LoginRegister';
import SetupPage from './pages/SetupPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import RegisteredEventsPage from './pages/RegisteredEventsPage';
import MyEventsPage from './pages/MyEventsPage';
import RegisteredUsersPage from './pages/RegisteredUsersPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import SearchEventsPage from './pages/SearchEventsPage';
import EditProfilePage from './pages/EditProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import FAQPage from './pages/FAQPage';
import SupportPage from './pages/SupportPage';
import FavoritesPage from './pages/FavoritesPage';
import SubscribedOrganizersPage from './pages/SubscribedOrganizersPage';
import CalendarPage from './pages/CalendarPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import EditEventPage from './pages/EditEventPage';
import ChatPage from './pages/ChatPage';


import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCommentDetailsPage from './pages/AdminCommentDetailsPage';
import AdminEventDetailsPage from './pages/AdminEventDetailsPage';
import AdminSupportDetailsPage from './pages/AdminSupportDetailsPage';
import AdminUserDetailsPage from './pages/AdminUserDetailsPage';


import RequireAdmin from './components/RequireAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/registered-events" element={<RegisteredEventsPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/create" element={<CreateEventPage />} />
        <Route path="/event/:eventId/registered-users" element={<RegisteredUsersPage />} />
        <Route path="/edit-event/:id" element={<EditEventPage />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/search" element={<SearchEventsPage />} />
        <Route path="/user/:id/public-profile" element={<PublicProfilePage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/subscriptions" element={<SubscribedOrganizersPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/chat" element={<ChatPage />} />

        {}
        <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route path="/admin/comment/:id" element={<RequireAdmin><AdminCommentDetailsPage /></RequireAdmin>} />
        <Route path="/admin/event/:id" element={<RequireAdmin><AdminEventDetailsPage /></RequireAdmin>} />
        <Route path="/admin/support/:id" element={<RequireAdmin><AdminSupportDetailsPage /></RequireAdmin>} />
        <Route path="/admin/user/:id" element={<RequireAdmin><AdminUserDetailsPage /></RequireAdmin>} />
      </Routes>
    </Router>
  );
}

export default App;
