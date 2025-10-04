import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  FaSearch, 
  FaUsers, 
  FaClipboardList, 
  FaSignOutAlt,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaCheckCircle,
  FaUser
} from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'

const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Sample data - replace with API calls
  const [predictionData] = useState({
    count: 15,
    summary: "Based on your symptoms, our AI suggests a potential diagnosis of Seasonal Allergies. This is not a definitive diagnosis and should be confirmed by a healthcare professional."
  })

  const [suggestedDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Evelyn Hayes',
      specialty: 'Allergist',
      avatar: 'EH'
    },
    {
      id: 2,
      name: 'Dr. Owen Mitchell',
      specialty: 'General Practitioner',
      avatar: 'OM'
    },
    {
      id: 3,
      name: 'Dr. Chloe Turner',
      specialty: 'ENT Specialist',
      avatar: 'CT'
    }
  ])

  const [recommendations] = useState([
    'Schedule an appointment with an allergist.',
    'Avoid known allergens.',
    'Consider over-the-counter antihistamines.'
  ])

  const [bookingStatus] = useState([
    {
      doctor: 'Dr. Evelyn Hayes',
      status: 'confirmed',
      appointmentId: 'APT001'
    },
    {
      doctor: 'Dr. Owen Mitchell',
      status: 'confirmed',
      appointmentId: 'APT002'
    },
    {
      doctor: 'Dr. Chloe Turner',
      status: 'confirmed',
      appointmentId: 'APT003'
    }
  ])

  const sidebarItems = [
    { 
      icon: FaClipboardList, 
      label: 'Predictions', 
      href: '/dashboard', 
      active: location.pathname === '/dashboard' || location.pathname === '/dashboard/predictions'
    },
    { 
      icon: FaUsers, 
      label: 'Contact Doctor', 
      href: '/dashboard/contact-doctor'
    },
    { 
      icon: FaCalendarAlt, 
      label: 'Booking Status', 
      href: '/dashboard/booking-status'
    },
    { 
      icon: FaUser, 
      label: 'Profile', 
      href: '/dashboard/profile'
    },
    { 
      icon: FaSignOutAlt, 
      label: 'Logout', 
      href: '#',
      isLogout: true
    }
  ]

  const handleBookAppointment = () => {
    // Handle appointment booking logic
    console.log('Booking appointment with:', selectedDoctor, selectedDate, selectedTime)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSidebarClick = (item, e) => {
    if (item.isLogout) {
      e.preventDefault()
      handleLogout()
    }
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar col-md-3 col-lg-2 p-0">
        <div className="p-3">
          <div className="d-flex align-items-center mb-4">
            <div className="avatar me-3">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RB'}
            </div>
            <div>
              <h6 className="mb-0">{user?.name || 'Ryan Bennett'}</h6>
              <small className="text-muted">Patient ID: {user?.patientId || '123456'}</small>
              <div><small className="text-muted">{user?.email || 'ryan.bennett@email.com'}</small></div>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`sidebar-item ${
                  item.active || location.pathname === item.href ? 'active' : ''
                }`}
                onClick={(e) => handleSidebarClick(item, e)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark">AI Symptom Checker</h2>
          </div>
          <Link to="/dashboard/check-symptoms" className="btn btn-primary">
            <FaSearch className="me-2" />
            Check Symptoms
          </Link>
        </div>

        {/* Prediction Summary Card */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar me-3 bg-success">
                        {predictionData.count}
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Predictions</h6>
                        <small className="text-muted">Based on your recent symptoms</small>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Prediction Summary</h5>
                      <p className="text-muted mb-3">{predictionData.summary}</p>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Suggested Doctors</h6>
                      <div className="row g-3">
                        {suggestedDoctors.map((doctor) => (
                          <div key={doctor.id} className="col-md-4">
                            <div className="doctor-card">
                              <div className="doctor-avatar mx-auto mb-3">
                                {doctor.avatar}
                              </div>
                              <h6 className="fw-bold mb-1">{doctor.name}</h6>
                              <p className="text-primary small mb-0">{doctor.specialty}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Recommendations</h6>
                      <div className="list-group list-group-flush">
                        {recommendations.map((recommendation, index) => (
                          <div key={index} className="list-group-item border-0 px-0">
                            <div className="d-flex align-items-start">
                              <FaCheckCircle className="text-success me-2 mt-1" size={16} />
                              <span>{recommendation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="btn btn-outline-primary">
                      <FaDownload className="me-2" />
                      Download Report (PDF)
                    </button>
                  </div>

                  <div className="col-lg-4">
                    <div className="bg-light rounded p-3 text-center">
                      <FaUserMd size={48} className="text-primary mb-3" />
                      <h6 className="fw-bold">Need Immediate Help?</h6>
                      <p className="small text-muted mb-3">
                        Contact our medical team for urgent consultations
                      </p>
                      <Link to="/dashboard/contact-doctor" className="btn btn-primary btn-sm">
                        Contact Doctor
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Doctor Section */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Contact Doctor</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by doctor name or specialty..."
                      />
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Dr. Evelyn Hayes</h6>
                      <p className="text-primary mb-2">Allergist</p>
                      <button className="btn btn-primary">Book Appointment</button>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Select Date</label>
                        <div className="input-group">
                          <input
                            type="date"
                            className="form-control"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                          <span className="input-group-text">
                            <FaCalendarAlt />
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Select Time</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                          >
                            <option value="">Choose a time</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                          </select>
                          <span className="input-group-text">
                            <FaClock />
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleBookAppointment}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Book Appointment
                    </button>
                  </div>

                  <div className="col-lg-4">
                    <div className="text-center">
                      <div className="doctor-avatar mx-auto mb-3" style={{ width: '120px', height: '120px', fontSize: '2.5rem' }}>
                        EH
                      </div>
                      <h6 className="fw-bold">Dr. Evelyn Hayes</h6>
                      <p className="text-primary small">Allergist</p>
                      <div className="bg-light rounded p-3 mt-3">
                        <small className="text-muted">
                          <strong>Experience:</strong> 15+ years<br />
                          <strong>Rating:</strong> ⭐⭐⭐⭐⭐ 4.9/5<br />
                          <strong>Available:</strong> Mon-Fri
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Booking Status</h5>
              </div>
              <div className="card-body">
                {bookingStatus.map((booking, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                    <div>
                      <h6 className="mb-1 fw-semibold">{booking.doctor}</h6>
                      <small className="text-muted">Appointment Status</small>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-success">
                        <FaCheckCircle className="me-1" />
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <h6 className="fw-bold mb-2">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <Link to="/dashboard/booking-status" className="btn btn-outline-primary btn-sm">
                      View All Appointments
                    </Link>
                    <button className="btn btn-outline-secondary btn-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 fw-bold">Recent Activity</h5>
          </div>
          <div className="card-body">
            <div className="timeline">
              <div className="d-flex mb-3">
                <div className="bg-primary rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                <div>
                  <h6 className="mb-1 fw-semibold">Symptom Check Completed</h6>
                  <small className="text-muted">2 hours ago - Seasonal Allergies detected</small>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                <div>
                  <h6 className="mb-1 fw-semibold">Appointment Booked</h6>
                  <small className="text-muted">1 day ago - Dr. Evelyn Hayes</small>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="bg-info rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                <div>
                  <h6 className="mb-1 fw-semibold">Report Downloaded</h6>
                  <small className="text-muted">3 days ago - Health Summary Report</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard