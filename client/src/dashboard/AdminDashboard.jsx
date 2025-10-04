import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaUserPlus, 
  FaUsers, 
  FaCalendarCheck, 
  FaUserCog, 
  FaSignOutAlt,
  FaSearch,
  FaEye,
  FaTrash,
  FaFileExport
} from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../auth/AuthContext'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('Doctor List')
  const [searchTerm, setSearchTerm] = useState('')

  // Sample data - replace with API calls
  const [dashboardData] = useState({
    registeredPatients: 1250,
    doctors: 75,
    totalBookings: 3500,
    predictions: 10000
  })

  const [chartData] = useState([
    { month: 'Jan', bookings: 300, predictions: 800 },
    { month: 'Feb', bookings: 320, predictions: 850 },
    { month: 'Mar', bookings: 280, predictions: 780 },
    { month: 'Apr', bookings: 350, predictions: 920 },
    { month: 'May', bookings: 380, predictions: 950 },
    { month: 'Jun', bookings: 420, predictions: 1100 }
  ])

  const [doctorsList] = useState([
    {
      id: 1,
      name: 'Dr. Ethan Carter',
      department: 'Cardiology',
      qualification: 'MD',
      experience: '10 years'
    },
    {
      id: 2,
      name: 'Dr. Olivia Bennett',
      department: 'Neurology',
      qualification: 'MD',
      experience: '8 years'
    },
    {
      id: 3,
      name: 'Dr. Noah Harper',
      department: 'Pediatrics',
      qualification: 'MD',
      experience: '12 years'
    },
    {
      id: 4,
      name: 'Dr. Ava Foster',
      department: 'Dermatology',
      qualification: 'MD',
      experience: '5 years'
    },
    {
      id: 5,
      name: 'Dr. Liam Hayes',
      department: 'Oncology',
      qualification: 'MD',
      experience: '15 years'
    }
  ])

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaUserPlus, label: 'Doctor Registration', href: '/dashboard/doctor-registration' },
    { icon: FaUsers, label: 'Patient Bookings', href: '/dashboard/patient-bookings' },
    { icon: FaUserCog, label: 'User Management', href: '/dashboard/user-management' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = ['Doctor List', 'Patient List', 'Booking List']

  const filteredDoctors = doctorsList.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar col-md-3 col-lg-2 p-0">
        <div className="p-3">
          <div className="d-flex align-items-center mb-4">
            <div className="avatar me-3">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h6 className="mb-0">{user?.name}</h6>
              <small className="text-muted">Admin ID: {user?.id || '12345'}</small>
              <div><small className="text-muted">{user?.email}</small></div>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-item${isActive ? ' active' : ''}`
                }
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="sidebar-item border-0 bg-transparent w-100 text-start"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaSignOutAlt size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">Admin Dashboard</h2>
          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ width: '300px' }}>
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search doctors, patients, records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.registeredPatients.toLocaleString()}</div>
                  <div className="stats-label">Registered Patients</div>
                  <small className="growth-positive">+10%</small>
                </div>
                <FaUsers className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.doctors}</div>
                  <div className="stats-label">Doctors</div>
                  <small className="growth-positive">+5%</small>
                </div>
                <FaUserPlus className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.totalBookings.toLocaleString()}</div>
                  <div className="stats-label">Total Bookings</div>
                  <small className="growth-positive">+15%</small>
                </div>
                <FaCalendarCheck className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.predictions.toLocaleString()}</div>
                  <div className="stats-label">Predictions</div>
                  <small className="growth-positive">+20%</small>
                </div>
                <FaSearch className="text-primary" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Booking Status</h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success">Completed +5%</span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="text-center">
                      <div className="display-4 fw-bold text-primary">75%</div>
                      <div className="text-muted">Completed</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center">
                      <div className="display-4 fw-bold text-warning">25%</div>
                      <div className="text-muted">Pending</div>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#20b2aa" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Platform Usage</h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="display-4 fw-bold text-primary">25%</div>
                  <div className="text-muted">Pending +2%</div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="predictions" stroke="#20b2aa" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 fw-bold">Quick Overview</h5>
          </div>
          <div className="card-body">
            {/* Tabs */}
            <ul className="nav nav-tabs border-0 mb-4">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? 'active border-primary text-primary' : 'text-muted'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            {/* Doctor List Content */}
            {activeTab === 'Doctor List' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-muted mb-0">Preview of registered doctors</p>
                  <Link to="/dashboard/doctor-registration" className="btn btn-sm btn-primary">
                    View All Doctors
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Qualification</th>
                        <th>Experience</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.slice(0, 5).map((doctor) => (
                        <tr key={doctor.id}>
                          <td className="fw-semibold">{doctor.name}</td>
                          <td>
                            <span className="badge bg-light text-primary">{doctor.department}</span>
                          </td>
                          <td>{doctor.qualification}</td>
                          <td>{doctor.experience}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary">
                                <FaEye size={14} />
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <FaTrash size={14} />
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <FaFileExport size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Patient List Content */}
            {activeTab === 'Patient List' && (
              <div className="text-center py-5">
                <FaUsers size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Patient List</h5>
                <p className="text-muted">View all registered patients in the system.</p>
                <Link to="/dashboard/patient-bookings" className="btn btn-primary">
                  View Patient Records
                </Link>
              </div>
            )}

            {/* Booking List Content */}
            {activeTab === 'Booking List' && (
              <div className="text-center py-5">
                <FaCalendarCheck size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Booking List</h5>
                <p className="text-muted">Manage all patient appointments and bookings.</p>
                <Link to="/dashboard/patient-bookings" className="btn btn-primary">
                  View All Bookings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard