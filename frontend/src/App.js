import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarManagement from './pages/CarManagement';
import UserManagement from './pages/UserManagement';
import BookingManagement from './pages/BookingManagement';
import Calendrier from './pages/Calendrier';
import AnalyticsReports from './pages/AnalyticsReports';
import LocationContact from './pages/LocationContact';
import SettingsPreferences from './pages/SettingsPreferences';
import FeedbackReviews from './pages/FeedbackReviews';
import AvailableCar from './pages/AvailableCar'; 
import ProtectedRoute from './components/ProtectedRoute';
import ContactUs from './pages/ContactUs';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Profile from './pages/profile';
import Bookings from './pages/Bookings';
import Preferences from './pages/Preferences';
import Notifications from './pages/Notifications';
import HelpCenter from './pages/HelpCenter';
import ContactSupport from './pages/ContactSupport';
import Terms from './pages/Terms';
import Policy from './pages/Policy';
import Password from './pages/Password';
import VidangeManagement from './pages/VidangeManagement';
import AdminRegister from './pages/AdminRegister';
import { LanguageProvider } from './LanguageContext';
import './App.css';

// Create a wrapper component to handle navbar visibility
const AppContent = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    // List of routes where navbar should not be shown
    const noNavbarRoutes = [
        '/available-cars',
        '/contact-us',
        '/UserLogin',
        '/UserRegister',
        '/admin-register',
        '/profile',
        '/my-profile',
        '/bookings',
        '/my-bookings',
        '/preferences',
        '/notifications',
        '/help-center',
        '/contact-support',
        '/terms',
        '/policy',
        '/password',
        '/change-password',
        '/login',
        '/'  // home page
    ];

    // Check if navbar should be shown
    const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <div className="App">
            {shouldShowNavbar && <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />}
            <div className="main-content">
            <Routes>
                {/* Pages publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/available-cars" element={<AvailableCar />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-register" element={<AdminRegister />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route path="/UserRegister" element={<UserRegister />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/policy" element={<Policy />} />

                {/* Pages protégées - nécessitent une authentification */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/my-profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/help-center" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
                <Route path="/contact-support" element={<ProtectedRoute><ContactSupport /></ProtectedRoute>} />
                <Route path="/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/change-password" element={<ProtectedRoute><Password /></ProtectedRoute>} />

                {/* Pages admin protégées */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/cars" element={<ProtectedRoute><CarManagement /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><BookingManagement /></ProtectedRoute>} />
                <Route path="/calendrier" element={<ProtectedRoute><Calendrier /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsReports /></ProtectedRoute>} />
                <Route path="/location" element={<ProtectedRoute><LocationContact /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPreferences /></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><FeedbackReviews /></ProtectedRoute>} />
                <Route path="/vidanges/:carId" element={<ProtectedRoute><VidangeManagement /></ProtectedRoute>} />
            </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </Router>
    );
}

export default App;
