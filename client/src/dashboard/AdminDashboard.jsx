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
  FaFileExport,
  FaTimes,
  FaBars
} from 'react-icons/fa'

import { useAuth } from '../auth/AuthContext'
import api from '../services/api'
import { authService } from '../services/authService'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('Doctor List')
  const [searchTerm, setSearchTerm] = useState('')

  const [dashboardData, setDashboardData] = useState({
    registeredPatients: 0,
    doctors: 0,
    totalBookings: 0,
    predictions: 0
  })

  const [chartData, setChartData] = useState([])

  const [doctorsList, setDoctorsList] = useState([])
  const [patientsList, setPatientsList] = useState([])
  const [bookingsList, setBookingsList] = useState([])
  const [predictionsCountScoped, setPredictionsCountScoped] = useState(0)
  const [bookingPerc, setBookingPerc] = useState({ completed: 0, pending: 0, cancelled: 0, pendingDelta: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        // Overview counts
        const adminToken = localStorage.getItem('token')
        const overviewRes = await api.get(`/admin/overview?admin_token=${adminToken}`)
        if (overviewRes.success) {
          setDashboardData(overviewRes.overview)
        }

        // Doctors list (limit display later)
        const docsRes = await authService.getAllDoctors()
        if (docsRes.success) {
          setDoctorsList(docsRes.doctors || [])
        }

        // Patients list under this admin
        const patsRes = await api.get(`/admin/patients?admin_token=${adminToken}`)
        if (patsRes.success) {
          setPatientsList(patsRes.patients || [])
        }

        // Bookings under this admin
        const bRes = await api.get(`/admin/bookings?admin_token=${adminToken}`)
        if (bRes.success) {
          setBookingsList(bRes.bookings || [])
        }

        // Charts data
        const chartRes = await api.get(`/admin/analytics?admin_token=${adminToken}`)
        if (chartRes.success) {
          const merged = (chartRes.chart.bookings || []).map((b, i) => ({
            month: b.month,
            bookings: b.bookings,
            predictions: (chartRes.chart.predictions[i]?.predictions) || 0
          }))
          setChartData(merged)
        }

        // Compute predictions scoped to admin (admin self + their doctors)
        let totalPreds = 0
        try {
          const adminPred = await api.get(`/predictions/get?user_id=${adminToken}`)
          if (adminPred.success) totalPreds += (adminPred.count || adminPred.predictions?.length || 0)
        } catch { }
        for (const doc of (doctorsList || [])) {
          try {
            const res = await api.get(`/predictions/get?user_id=${doc.id}`)
            if (res.success) totalPreds += (res.count || res.predictions?.length || 0)
          } catch { }
        }
        setPredictionsCountScoped(totalPreds)

        // Compute booking completion/pending/cancelled percentages and delta
        const total = (bRes.bookings || []).length
        const completed = (bRes.bookings || []).filter(b => (b.status || '').toLowerCase() === 'completed').length
        const pending = (bRes.bookings || []).filter(b => (b.status || '').toLowerCase() === 'pending').length
        const cancelled = (bRes.bookings || []).filter(b => (b.status || '').toLowerCase() === 'cancelled').length
        const completedPct = total ? Math.round((completed / total) * 100) : 0
        const pendingPct = total ? Math.round((pending / total) * 100) : 0
        const cancelledPct = total ? Math.round((cancelled / total) * 100) : 0
        // Delta for pending vs previous month using chart data if available
        let pendingDelta = 0
        const months = chartRes.success ? chartRes.chart.bookings : []
        if (months && months.length >= 2) {
          // Fallback: use bookings count change as proxy for pending delta
          pendingDelta = ((months[months.length - 1].bookings - months[months.length - 2].bookings) >= 0) ? 2 : -2
        }
        setBookingPerc({ completed: completedPct, pending: pendingPct, cancelled: cancelledPct, pendingDelta })
      } catch (e) {
        // no-op
      }
    }
    load()
  }, [])

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaUserPlus, label: 'Doctor Registration', href: '/dashboard/doctor-registration' },
    { icon: FaUsers, label: 'Patient Bookings', href: '/dashboard/patient-bookings' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = ['Doctor List', 'Patient List', 'Booking List']

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        const adminToken = localStorage.getItem('token')
        const res = await api.get(`/doctors/delete?doctor_id=${doctorId}&admin_token=${adminToken}`)
        if (res.success) {
          setDoctorsList(doctorsList.filter(d => d.id !== doctorId))
        } else {
          alert('Failed to delete doctor: ' + (res.error || 'Unknown error'))
        }
      } catch (e) {
        alert('Error deleting doctor')
      }
    }
  }

  const handleViewDoctor = (doctor) => {
    alert(`Doctor Details:\n\nName: ${doctor.name}\nDepartment: ${doctor.department}\nSpecialization: ${doctor.specialization}\nQualification: ${doctor.qualification}\nExperience: ${doctor.experience}\nEmail: ${doctor.email}\nPhone: ${doctor.phone}\nStatus: ${doctor.status}`)
  }

  const filteredDoctors = doctorsList.filter(doctor =>
    (doctor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Toggle */}
      <div className="d-md-none p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-bold">Admin Menu</span>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row">
        {/* Sidebar */}
        <div className={`sidebar col-md-3 col-lg-2 p-0 ${isSidebarOpen ? 'd-block' : 'd-none d-md-block'}`}>
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
                  </div>
                  <FaCalendarCheck className="text-primary" size={24} />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stats-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="stats-number">{(predictionsCountScoped || 0).toLocaleString()}</div>
                    <div className="stats-label">Predictions</div>
                  </div>
                  <FaSearch className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="row g-4 mb-4">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Booking Status</h5>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="text-center">
                        <div className="display-4 fw-bold text-primary">{bookingPerc.completed}%</div>
                        <div className="text-muted">Completed</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-center">
                        <div className="display-4 fw-bold text-danger">{bookingPerc.cancelled}%</div>
                        <div className="text-muted">Cancelled</div>
                      </div>
                    </div>
                  </div>

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
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleViewDoctor(doctor)}
                                >
                                  <FaEye size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteDoctor(doctor.id)}
                                >
                                  <FaTrash size={14} />
                                </button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => window.open(`${import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://disease-prediction-3z87.onrender.com/api' : 'http://localhost:5000/api')}/predictions/pdf?user_id=${doctor.id}`, '_blank')}>
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
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="text-muted mb-0">Patients who have booked with your doctors</p>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientsList.slice(0, 5).map((p, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold">{p.name}</td>
                            <td>{p.email || '-'}</td>
                            <td>{p.phone || '-'}</td>
                            <td>{p.address || '-'}</td>
                          </tr>
                        ))}
                        {patientsList.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">No patients found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Booking List Content */}
              {activeTab === 'Booking List' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="text-muted mb-0">Recent bookings under your doctors</p>
                    <Link to="/dashboard/patient-bookings" className="btn btn-sm btn-primary">View All Bookings</Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Booking ID</th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Department</th>
                          <th>Appointment</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingsList.slice(0, 5).map((b) => (
                          <tr key={b.booking_id}>
                            <td className="fw-semibold">{b.booking_id}</td>
                            <td>{b.name}</td>
                            <td>{b.doctor}</td>
                            <td><span className="badge bg-light text-primary">{b.department}</span></td>
                            <td>{b.appointment ? new Date(b.appointment).toISOString().slice(0, 10) : '-'}</td>
                            <td>
                              <span className={`badge ${(b.status || '').toLowerCase() === 'confirmed' ? 'bg-success' : (b.status || '').toLowerCase() === 'pending' ? 'bg-warning text-dark' : (b.status || '').toLowerCase() === 'completed' ? 'bg-info' : (b.status || '').toLowerCase() === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                                {(b.status || '').charAt(0).toUpperCase() + (b.status || '').slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {bookingsList.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center text-muted">No bookings found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard