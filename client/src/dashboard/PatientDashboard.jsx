import React, { useState, useEffect } from 'react'
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
  FaUser,
  FaEye
} from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'
import { authService } from '../services/authService'
import { notificationService } from '../services/api'

const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // Fetch predictions from API
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true)
        const response = await authService.getPredictions()
        
        if (response.success && response.predictions) {
          // Convert API response to the format expected by the UI
          const formattedPredictions = response.predictions.map((pred) => ({
            id: pred.id,
            date: pred.date,
            symptoms: Array.isArray(pred.symptoms) ? pred.symptoms : [pred.symptoms],
            prediction: pred.prediction,
            confidence: pred.confidence,
            severity: pred.severity,
            status: pred.status,
            doctor: 'Self',
            recommendations: []
          }))
          
          setPredictions(formattedPredictions)
          formattedPredictions.slice(0,5).forEach(p => {
            notificationService.add({
              key: `pred-${p.id}-${p.date}-${p.prediction}`,
              title: 'Prediction Completed',
              message: `${p.prediction} (${p.severity})`,
              type: 'primary'
            })
          })
        }
      } catch (error) {
        console.error('Error fetching predictions:', error)
        setPredictions([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPredictions()
  }, [])

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

  // Filter and sort predictions
  const filteredPredictions = predictions
    .filter(prediction => {
      const matchesSearch = prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prediction.symptoms.some(symptom => 
                             typeof symptom === 'string' && symptom.toLowerCase().includes(searchTerm.toLowerCase())
                           )
      
      const statusLower = (prediction.status || '').toLowerCase()
      const severity = prediction.severity || ''
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'completed' && statusLower === 'completed') ||
                           (filterBy === 'review' && (statusLower === 'under review' || statusLower === 'review')) ||
                           (filterBy === 'high' && prediction.confidence >= 80) ||
                           (filterBy === 'moderate' && (severity === 'Moderate' || severity === 'moderate'))
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date)
        case 'confidence':
          return b.confidence - a.confidence
        case 'prediction':
          return a.prediction.localeCompare(b.prediction)
        default:
          return 0
      }
    })

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success'
    if (confidence >= 60) return 'text-warning'
    return 'text-danger'
  }

  const getSeverityBadge = (severity) => {
    const badges = {
      'Low': 'bg-success',
      'Moderate': 'bg-warning text-dark',
      'High': 'bg-danger'
    }
    return badges[severity] || 'bg-secondary'
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Completed': 'bg-success',
      'Under Review': 'bg-warning text-dark',
      'Pending': 'bg-info'
    }
    return badges[status] || 'bg-secondary'
  }

  if (loading) {
    return (
      <div className="d-flex">
        <div className="sidebar col-md-3 col-lg-2 p-0">
          <div className="p-3">
            <div className="d-flex align-items-center mb-4">
              <div className="avatar me-3">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RB'}
              </div>
              <div>
                <h6 className="mb-0">{user?.name || 'Ryan Bennett'}</h6>
              <small className="text-muted">Patient ID: {user?.id || '---'}</small>
              </div>
            </div>

            <nav>
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`sidebar-item ${item.active || location.pathname === item.href ? 'active' : ''}`}
                  onClick={(e) => handleSidebarClick(item, e)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-grow-1 p-4 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading predictions...</p>
        </div>
      </div>
    )
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
              <small className="text-muted">Patient ID: {user?.id || '---'}</small>
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

        {/* Filters and Search */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="form-label fw-semibold">Search Predictions</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by disease, symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label fw-semibold">Filter By</label>
                <select
                  className="form-select"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="all">All Predictions</option>
                  <option value="completed">Completed</option>
                  <option value="review">Under Review</option>
                  <option value="high">High Confidence (80%+)</option>
                  <option value="moderate">Moderate Severity</option>
                </select>
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label fw-semibold">Sort By</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="confidence">Confidence (Highest First)</option>
                  <option value="prediction">Disease Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Predictions Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Prediction Records</h5>
              <span className="badge bg-light text-dark">
                {filteredPredictions.length} records
              </span>
            </div>
          </div>
          
          <div className="card-body p-0">
            {filteredPredictions.length === 0 ? (
              <div className="text-center py-5">
                <FaClipboardList size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No predictions found</h5>
                <p className="text-muted">Try making a new prediction to see your records here</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Prediction</th>
                      <th>Symptoms</th>
                      <th>Confidence</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Doctor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPredictions.map((prediction) => (
                      <tr key={prediction.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="text-muted me-2" size={14} />
                            <span className="fw-semibold">
                              {prediction.date}
                            </span>
                          </div>
                        </td>
                        
                        <td>
                          <div className="fw-semibold text-primary">
                            {prediction.prediction}
                          </div>
                        </td>
                        
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {prediction.symptoms.slice(0, 2).map((symptom, index) => (
                              <span key={index} className="badge bg-light text-dark small">
                                {symptom}
                              </span>
                            ))}
                            {prediction.symptoms.length > 2 && (
                              <span className="badge bg-secondary small">
                                +{prediction.symptoms.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        
                        <td>
                          <div className={`fw-bold ${getConfidenceColor(prediction.confidence)}`}>
                            {prediction.confidence}%
                          </div>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div
                              className={`progress-bar ${prediction.confidence >= 80 ? 'bg-success' : prediction.confidence >= 60 ? 'bg-warning' : 'bg-danger'}`}
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                        </td>
                        
                        <td>
                          <span className={`badge ${getSeverityBadge(prediction.severity)}`}>
                            {prediction.severity}
                          </span>
                        </td>
                        
                        <td>
                          <span className={`badge ${getStatusBadge(prediction.status)}`}>
                            {prediction.status}
                          </span>
                        </td>
                        
                        <td>
                          <div className="small text-muted">
                            {prediction.doctor || '-'}
                          </div>
                        </td>
                        
                        <td>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              title="View Details"
                            >
                              <FaEye size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard