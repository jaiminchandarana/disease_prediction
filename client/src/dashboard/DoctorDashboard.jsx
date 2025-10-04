import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

import { useAuth } from '../auth/AuthContext'

const DoctorDashboard = () => {
  const { user, logout } = useAuth()

  // Sample data - replace with API calls
  const [dashboardData] = useState({
    totalPredictions: 234,
    totalPatients: 150,
    latestReports: 12
  })

  const [weeklyData] = useState([
    { day: 'Mon', predictions: 30 },
    { day: 'Tue', predictions: 45 },
    { day: 'Wed', predictions: 35 },
    { day: 'Thu', predictions: 50 },
    { day: 'Fri', predictions: 40 },
    { day: 'Sat', predictions: 25 },
    { day: 'Sun', predictions: 35 }
  ])

  const [diseaseData] = useState([
    { disease: 'Disease A', frequency: 85 },
    { disease: 'Disease B', frequency: 70 },
    { disease: 'Disease C', frequency: 60 },
    { disease: 'Disease D', frequency: 45 },
    { disease: 'Disease E', frequency: 30 }
  ])

  const [patientList] = useState([
    { name: 'Liam Harper', date: '2023-08-15', status: 'Completed' },
    { name: 'Olivia Bennett', date: '2023-08-10', status: 'Pending' },
    { name: 'Noah Foster', date: '2023-08-05', status: 'Completed' },
    { name: 'Ava Coleman', date: '2023-07-30', status: 'Pending' },
    { name: 'Jackson Hayes', date: '2023-07-25', status: 'Completed' }
  ])

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: FaSearch, label: 'Prediction Tool', href: '/predict' },
    { icon: FaUsers, label: 'Patient Records', href: '/history' },
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
              <small className="text-muted">ID: 12345</small>
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

        {/* Trends Section */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Weekly Prediction Trends</h5>
                  <div className="d-flex align-items-center gap-2">
                    {/* ✅ Using correct trending up icon from Material Design */}
                    <MdTrendingUp className="text-success" />
                    <span className="text-success fw-semibold">+12%</span>
                    <small className="text-muted">Last 7 Days +12%</small>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="predictions" 
                      stroke="#20b2aa" 
                      strokeWidth={3}
                      dot={{ fill: '#20b2aa', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Disease Frequency</h5>
                  <div className="d-flex align-items-center gap-2">
                    {/* ✅ Using correct trending down icon */}
                    <MdTrendingDown className="text-danger" />
                    <span className="text-danger fw-semibold">-5%</span>
                  </div>
                </div>
                <small className="text-muted">Last 30 Days -5%</small>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={diseaseData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="disease" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="frequency" fill="#20b2aa" />
                  </BarChart>
                </ResponsiveContainer>
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
                        <span className={`badge ${
                          patient.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'
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