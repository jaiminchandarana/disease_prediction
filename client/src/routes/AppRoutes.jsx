import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Navbar from '../components/Navbar';

// Public Pages
import Home from '../pages/Home';
import About from '../components/About';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Login from '../auth/Login';
import Register from '../auth/Register';

// Dashboard Components
import AdminDashboard from '../dashboard/AdminDashboard';
import DoctorDashboard from '../dashboard/DoctorDashboard';
import PatientDashboard from '../dashboard/PatientDashboard';

// Admin-specific pages
import DoctorRegistration from '../pages/DoctorRegistration';
import PatientBookings from '../pages/PatientBookings';
import UserManagement from '../pages/UserManagement';

// Patient-specific pages
import ContactDoctor from '../components/patient/ContactDoctor';
import BookingStatus from '../components/patient/BookingStatus';

// Protected Pages
import Profile from '../pages/Profile';
import History from '../pages/History';
import Predict from '../pages/Predict';
import Explain from '../pages/Explain';

// New AI Assistant Routes
import ChatInterface from '../components/ChatInterface';
import ImageAnalysis from '../components/ImageAnalysis';
import AdminAnalytics from '../components/AdminAnalytics';

// Loading Component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Route Component
const DashboardRoute = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          } 
        />

        {/* Admin-specific Routes */}
        <Route 
          path="/dashboard/doctor-registration" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DoctorRegistration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/patient-bookings" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PatientBookings />
            </ProtectedRoute>
          } 
        />
        {/* FIXED: Removed duplicate route */}
        <Route 
          path="/dashboard/user-management" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />

        {/* Enhanced AI Prediction Routes - Role Based */}
        <Route 
          path="/ai-assistant" 
          element={
            <ProtectedRoute>
              <Predict />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/ai-assistant" 
          element={
            <ProtectedRoute>
              <Predict />
            </ProtectedRoute>
          } 
        />

        {/* Patient-specific AI routes */}
        <Route 
          path="/dashboard/symptom-checker" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Predict />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/health-chat" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <ChatInterface />
            </ProtectedRoute>
          } 
        />

        {/* Doctor-specific AI routes */}
        <Route 
          path="/dashboard/clinical-assistant" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Predict />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/image-analysis" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <ImageAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/patient-analysis" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Predict />
            </ProtectedRoute>
          } 
        />

        {/* Admin-specific AI routes */}
        <Route 
          path="/dashboard/system-analytics" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin-assistant" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Predict />
            </ProtectedRoute>
          } 
        />

        {/* Patient Dashboard Sub-routes */}
        <Route 
          path="/dashboard/predictions" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/contact-doctor" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <ContactDoctor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/booking-status" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookingStatus />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Updated legacy predict route to enhanced version */}
        <Route 
          path="/dashboard/check-symptoms" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Predict />
            </ProtectedRoute>
          } 
        />

        {/* Legacy routes for backward compatibility */}
        <Route 
          path="/contact-doctor" 
          element={<Navigate to="/dashboard/contact-doctor" replace />}
        />
        <Route 
          path="/booking-status" 
          element={<Navigate to="/dashboard/booking-status" replace />}
        />
        <Route 
          path="/predict" 
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
              <Predict />
            </ProtectedRoute>
          } 
        />

        {/* Other protected routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explain" 
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <Explain />
            </ProtectedRoute>
          } 
        />

        {/* New Chat Interface Routes */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          } 
        />

        {/* Error Routes */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="container mt-5 text-center">
              <h1>403 - Unauthorized</h1>
              <p>You don't have permission to access this page.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          } 
        />
        <Route 
          path="*" 
          element={
            <div className="container mt-5 text-center">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>
          } 
        />
      </Routes>
    </>
  );
};

export default AppRoutes;