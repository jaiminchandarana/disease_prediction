import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaCalendarAlt,
  FaChartLine,
  FaFileAlt
} from 'react-icons/fa'
// ✅ Fixed: Import trending icons from Material Design
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md'

const History = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [predictions, setPredictions] = useState([])
  const [stats, setStats] = useState({})

  // Sample data - replace with API calls
  useEffect(() => {
    const samplePredictions = [
      {
        id: 1,
        date: '2023-08-15',
        symptoms: ['Fever', 'Cough', 'Fatigue'],
        prediction: 'Common Cold',
        confidence: 85,
        severity: 'Low',
        status: 'Completed',
        doctor: 'Dr. Sarah Johnson',
        recommendations: ['Rest', 'Hydration', 'Monitor symptoms']
      },
      {
        id: 2,
        date: '2023-08-10',
        symptoms: ['Headache', 'Nausea', 'Dizziness'],
        prediction: 'Migraine',
        confidence: 78,
        severity: 'Moderate',
        status: 'Under Review',
        doctor: 'Dr. Michael Chen',
        recommendations: ['Dark room', 'Pain medication', 'Follow-up needed']
      },
      {
        id: 3,
        date: '2023-08-05',
        symptoms: ['Joint pain', 'Stiffness', 'Swelling'],
        prediction: 'Arthritis',
        confidence: 72,
        severity: 'Moderate',
        status: 'Completed',
        doctor: 'Dr. Emily Davis',
        recommendations: ['Physical therapy', 'Anti-inflammatory', 'Regular exercise']
      },
      {
        id: 4,
        date: '2023-07-30',
        symptoms: ['Chest pain', 'Shortness of breath'],
        prediction: 'Anxiety',
        confidence: 68,
        severity: 'Low',
        status: 'Completed',
        doctor: 'Dr. Robert Wilson',
        recommendations: ['Stress management', 'Breathing exercises', 'Counseling']
      },
      {
        id: 5,
        date: '2023-07-25',
        symptoms: ['Skin rash', 'Itching', 'Redness'],
        prediction: 'Allergic Reaction',
        confidence: 90,
        severity: 'Low',
        status: 'Completed',
        doctor: 'Dr. Lisa Anderson',
        recommendations: ['Avoid allergens', 'Antihistamines', 'Topical cream']
      }
    ]

    const sampleStats = {
      totalPredictions: samplePredictions.length,
      averageConfidence: Math.round(samplePredictions.reduce((acc, p) => acc + p.confidence, 0) / samplePredictions.length),
      completedPredictions: samplePredictions.filter(p => p.status === 'Completed').length,
      underReview: samplePredictions.filter(p => p.status === 'Under Review').length
    }

    setPredictions(samplePredictions)
    setStats(sampleStats)
  }, [])

  // Filter and sort predictions
  const filteredPredictions = predictions
    .filter(prediction => {
      const matchesSearch = prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prediction.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'completed' && prediction.status === 'Completed') ||
                           (filterBy === 'review' && prediction.status === 'Under Review') ||
                           (filterBy === 'high' && prediction.confidence >= 80) ||
                           (filterBy === 'moderate' && prediction.severity === 'Moderate')
      
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

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Prediction History</h2>
          <p className="text-muted mb-0">View and manage your health predictions</p>
        </div>
        <button className="btn btn-primary">
          <FaDownload className="me-2" />
          Export All
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="stats-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stats-number">{stats.totalPredictions}</div>
                <div className="stats-label">Total Predictions</div>
              </div>
              <FaChartLine className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="stats-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stats-number">{stats.averageConfidence}%</div>
                <div className="stats-label">Average Confidence</div>
                <small className="growth-positive">
                  {/* ✅ Fixed: Using correct trending up icon */}
                  <MdTrendingUp className="me-1" />
                  +5%
                </small>
              </div>
              <MdTrendingUp className="text-success" size={24} />
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="stats-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stats-number">{stats.completedPredictions}</div>
                <div className="stats-label">Completed</div>
                <small className="growth-positive">
                  {/* ✅ Fixed: Using correct trending up icon */}
                  <MdTrendingUp className="me-1" />
                  +2
                </small>
              </div>
              <FaFileAlt className="text-success" size={24} />
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="stats-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="stats-number">{stats.underReview}</div>
                <div className="stats-label">Under Review</div>
                <small className="growth-negative">
                  {/* ✅ Fixed: Using correct trending down icon */}
                  <MdTrendingDown className="me-1" />
                  -1
                </small>
              </div>
              <FaEye className="text-warning" size={24} />
            </div>
          </div>
        </div>
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

            <div className="col-lg-2">
              <button className="btn btn-outline-primary w-100">
                <FaFilter className="me-2" />
                Advanced
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Prediction Records</h5>
            <span className="badge bg-light text-dark">
              {filteredPredictions.length} of {predictions.length} records
            </span>
          </div>
        </div>
        
        <div className="card-body p-0">
          {filteredPredictions.length === 0 ? (
            <div className="text-center py-5">
              <FaFileAlt size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No predictions found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
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
                            {new Date(prediction.date).toLocaleDateString()}
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
                          {prediction.doctor}
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
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            title="Download Report"
                          >
                            <FaDownload size={12} />
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
        
        {/* Pagination */}
        {filteredPredictions.length > 0 && (
          <div className="card-footer bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {filteredPredictions.length} of {predictions.length} records
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Timeline */}
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Recent Activity</h6>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="d-flex mb-3">
                  <div className="bg-primary rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                  <div>
                    <h6 className="mb-1 fw-semibold">New Prediction Completed</h6>
                    <small className="text-muted">2 hours ago - Common Cold diagnosed</small>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="bg-success rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                  <div>
                    <h6 className="mb-1 fw-semibold">Report Downloaded</h6>
                    <small className="text-muted">1 day ago - Migraine assessment report</small>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div className="bg-warning rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                  <div>
                    <h6 className="mb-1 fw-semibold">Follow-up Scheduled</h6>
                    <small className="text-muted">3 days ago - Arthritis consultation with Dr. Emily Davis</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <button className="btn btn-primary">
                  <FaSearch className="me-2" />
                  Start New Prediction
                </button>
                <button className="btn btn-outline-primary">
                  <FaDownload className="me-2" />
                  Export All Records
                </button>
                <button className="btn btn-outline-secondary">
                  <FaCalendarAlt className="me-2" />
                  Schedule Follow-up
                </button>
                <button className="btn btn-outline-info">
                  <FaEye className="me-2" />
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History