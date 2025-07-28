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
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

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
                <Route path="/" element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
                <Route path="/available-cars" element={<PublicOnlyRoute><AvailableCar /></PublicOnlyRoute>} />
                <Route path="/contact-us" element={<PublicOnlyRoute><ContactUs /></PublicOnlyRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-register" element={<AdminRegister />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route path="/UserRegister" element={<UserRegister />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/policy" element={<Policy />} />

                {/* Pages protégées - nécessitent une authentification */}
                <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
                <Route path="/my-profile" element={<UserRoute><Profile /></UserRoute>} />
                <Route path="/my-bookings" element={<UserRoute><Bookings /></UserRoute>} />
                <Route path="/preferences" element={<UserRoute><Preferences /></UserRoute>} />
                <Route path="/notifications" element={<UserRoute><Notifications /></UserRoute>} />
                <Route path="/help-center" element={<UserRoute><HelpCenter /></UserRoute>} />
                <Route path="/contact-support" element={<UserRoute><ContactSupport /></UserRoute>} />
                <Route path="/password" element={<UserRoute><Password /></UserRoute>} />
                <Route path="/change-password" element={<UserRoute><Password /></UserRoute>} />
            

                {/* Pages admin protégées */}
                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/cars" element={<AdminRoute><CarManagement /></AdminRoute>} />
                <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/bookings" element={<AdminRoute><BookingManagement /></AdminRoute>} />
                <Route path="/calendrier" element={<AdminRoute><Calendrier /></AdminRoute>} />
                <Route path="/analytics" element={<AdminRoute><AnalyticsReports /></AdminRoute>} />
                <Route path="/location" element={<AdminRoute><LocationContact /></AdminRoute>} />
                <Route path="/settings" element={<AdminRoute><SettingsPreferences /></AdminRoute>} />
                <Route path="/feedback" element={<AdminRoute><FeedbackReviews /></AdminRoute>} />
                <Route path="/vidanges/:carId" element={<AdminRoute><VidangeManagement /></AdminRoute>} />
            </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <LanguageProvider>
            <Router>
                <AppContent />
            </Router>
        </LanguageProvider>
    );
}

export default App;
