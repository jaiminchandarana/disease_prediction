import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

// ✅ Fixed: Removed FaTrendingUp and added MdTrendingUp from Material Design icons
import {
  FaHome,
  FaSearch,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaChartLine
} from 'react-icons/fa'
import { MdTrendingDown, MdTrendingUp } from 'react-icons/md' // ✅ Both trending icons from Material Design



import { useAuth } from '../auth/AuthContext'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()

  const [dashboardData, setDashboardData] = useState({
    totalPredictions: 0,
    totalPatients: 0,
    latestReports: 0
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [patientList, setPatientList] = useState([])
  const [bookingPerc, setBookingPerc] = useState({ completed: 0, pending: 0, cancelled: 0 })

  useEffect(() => {
    const fetchDoctorStats = async () => {
      // doctor id is user.id
      const doctorId = user?.id;
      if (!doctorId) return;

      // 1. Fetch all predictions for this doctor
      let predictions = []
      let predictionPatientsSet = new Set();
      try {
        const res = await api.get(`/predictions/get?user_id=${doctorId}`)
        if (res.success && res.predictions) {
          predictions = res.predictions
          // gather unique patients from predictions (if schema supports)
          predictions.forEach(pred => {
            if (pred.doctor && pred.doctor !== user.name) predictionPatientsSet.add(pred.doctor)
          })
        }
      } catch { }

      // 2. Fetch all bookings for this doctor
      let bookings = []
      try {
        const res2 = await api.get(`/bookings?doctor_name=${user.name}`)
        if (res2.success && res2.bookings) {
          bookings = res2.bookings
          bookings.forEach(b => predictionPatientsSet.add(b.name))
        }
      } catch { }

      // 3. Stats
      const now = new Date()
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      const weeklyReports = predictions.filter(p => {
        if (!p.date) return false
        const d = new Date(p.date)
        return d >= weekAgo && d <= now
      }).length
      setDashboardData({
        totalPredictions: predictions.length,
        totalPatients: predictionPatientsSet.size,
        latestReports: weeklyReports
      })
      // 4. Patient list for this doctor
      setPatientList(bookings.slice(0, 10).map(b => ({
        name: b.name,
        date: b.appointment ? new Date(b.appointment).toISOString().slice(0, 10) : '-',
        status: (b.status || '').charAt(0).toUpperCase() + (b.status || '').slice(1)
      })))

      // 5. Calculate Booking Percentages
      const totalBookings = bookings.length
      const completedCount = bookings.filter(b => (b.status || '').toLowerCase() === 'completed').length
      const pendingCount = bookings.filter(b => (b.status || '').toLowerCase() === 'pending').length
      const cancelledCount = bookings.filter(b => (b.status || '').toLowerCase() === 'cancelled').length

      setBookingPerc({
        completed: totalBookings ? Math.round((completedCount / totalBookings) * 100) : 0,
        pending: totalBookings ? Math.round((pendingCount / totalBookings) * 100) : 0,
        cancelled: totalBookings ? Math.round((cancelledCount / totalBookings) * 100) : 0
      })

      // 6. Real Monthly Data (Bookings vs Predictions) - Last 6 Months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        return d
      })

      const newMonthlyData = last6Months.map(date => {
        const monthIndex = date.getMonth()
        const year = date.getFullYear()
        const monthName = months[monthIndex]

        // Filter for this month and year
        const predCount = predictions.filter(p => {
          if (!p.date) return false
          const d = new Date(p.date)
          return d.getMonth() === monthIndex && d.getFullYear() === year
        }).length

        const bookCount = bookings.filter(b => {
          if (!b.appointment) return false
          const d = new Date(b.appointment)
          return d.getMonth() === monthIndex && d.getFullYear() === year
        }).length

        return {
          month: monthName,
          predictions: predCount,
          bookings: bookCount
        }
      })
      setMonthlyData(newMonthlyData)
    }
    fetchDoctorStats()
  }, [user])

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: FaSearch, label: 'Prediction Tool', href: '/predict' },
    { icon: FaUsers, label: 'Patient Bookings', href: '/dashboard/patient-bookings' },
    { icon: FaUsers, label: 'Prediction Records', href: '/history' },
    { icon: FaSignOutAlt, label: 'Logout', href: '#' }
  ]

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
              <small className="text-muted">Doctor ID: {user?.id || '---'}</small>
              <div><small className="text-muted">{user?.email}</small></div>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item, index) => (
              item.label === 'Logout' ? (
                <button
                  key={index}
                  className={`sidebar-item btn btn-link text-start w-100 ${item.active ? 'active' : ''}`}
                  onClick={logout}
                  style={{ textDecoration: 'none' }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className={`sidebar-item ${item.active ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}</p>
        </div>

        {/* Overview Stats */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.totalPredictions}</div>
                  <div className="stats-label">Total Predictions</div>
                </div>
                <FaChartLine className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.totalPatients}</div>
                  <div className="stats-label">Total Patients</div>
                </div>
                <FaUsers className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{dashboardData.latestReports}</div>
                  <div className="stats-label">Latest Reports</div>
                </div>
                <FaClipboardList className="text-primary" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Section */}
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

        {/* Patient List */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Patient List</h5>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary">Date</button>
                <button className="btn btn-sm btn-outline-primary">Name</button>
                <button className="btn btn-sm btn-outline-primary">Status</button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientList.map((patient, index) => (
                    <tr key={index}>
                      <td className="fw-semibold">{patient.name}</td>
                      <td className="text-muted">{patient.date}</td>
                      <td>
                        <span className={`badge ${patient.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'
                          }`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard