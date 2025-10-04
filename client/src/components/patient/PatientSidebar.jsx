import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaUsers, 
  FaClipboardList, 
  FaSignOutAlt,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import ContactDoctor from '../components/patient/ContactDoctor';
import BookingStatus from '../components/patient/BookingStatus';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Sample data
  const [predictionData] = useState({
    count: 15,
    summary: "Based on your symptoms, our AI suggests a potential diagnosis of Seasonal Allergies. This is not a definitive diagnosis and should be confirmed by a healthcare professional."
  });

  const [suggestedDoctors] = useState([
    { id: 1, name: 'Dr. Evelyn Hayes', specialty: 'Allergist', avatar: 'EH' },
    { id: 2, name: 'Dr. Owen Mitchell', specialty: 'General Practitioner', avatar: 'OM' },
    { id: 3, name: 'Dr. Chloe Turner', specialty: 'ENT Specialist', avatar: 'CT' }
  ]);

  const [recommendations] = useState([
    'Schedule an appointment with an allergist.',
    'Avoid known allergens.',
    'Consider over-the-counter antihistamines.'
  ]);

  const [bookingStatus] = useState([
    { doctor: 'Dr. Evelyn Hayes', status: 'confirmed', appointmentId: 'APT001' },
    { doctor: 'Dr. Owen Mitchell', status: 'confirmed', appointmentId: 'APT002' },
    { doctor: 'Dr. Chloe Turner', status: 'confirmed', appointmentId: 'APT003' }
  ]);

  // Sidebar items
  const sidebarItems = [
    { icon: FaClipboardList, label: 'Predictions', to: '/dashboard' },
    { icon: FaUsers, label: 'Contact Doctor', to: '/contact-doctor' },
    { icon: FaCalendarAlt, label: 'Booking Status', to: '/booking-status' },
    { icon: FaSignOutAlt, label: 'Logout', to: '/login' }
  ];

  const handleBookAppointment = () => {
    console.log('Booking appointment with:', selectedDoctor, selectedDate, selectedTime);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar col-md-3 col-lg-2 p-0">
        <div className="p-3">
          <div className="d-flex align-items-center mb-4">
            <div className="avatar me-3">{user?.initials || 'RB'}</div>
            <div>
              <h6 className="mb-0">{user?.name || 'Ryan Bennett'}</h6>
              <small className="text-muted">Patient ID: {user?.id || 123456}</small>
              <div><small className="text-muted">{user?.email || 'ryan.bennett@email.com'}</small></div>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item, index) => (
              item.label === 'Logout' ? (
                <button
                  key={index}
                  className={`sidebar-item btn btn-link w-100 text-start d-flex align-items-center ${location.pathname === item.to ? 'active' : ''}`}
                  onClick={handleLogout}
                >
                  <item.icon size={18} className="me-2" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.to}
                  className={`sidebar-item d-flex align-items-center ${location.pathname === item.to ? 'active' : ''}`}
                >
                  <item.icon size={18} className="me-2" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h2 className="fw-bold text-dark">AI Symptom Checker</h2></div>
          <button className="btn btn-primary"><FaSearch className="me-2" />Check Symptoms</button>
        </div>

        {/* Prediction Summary Card */}
        {/* ... Keep the rest of your dashboard JSX unchanged ... */}

      </div>
    </div>
  );
};

export default PatientDashboard;
