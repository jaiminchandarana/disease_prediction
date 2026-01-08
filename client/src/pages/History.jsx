import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { authService } from '../services/authService'
import { notificationService } from '../services/api'
import {
  FaSearch,
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
  const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://disease-prediction-3z87.onrender.com/api' : 'http://localhost:5000/api')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [predictions, setPredictions] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

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
          formattedPredictions.slice(0, 5).forEach(p => {
            notificationService.add({
              key: `pred-${p.id}-${p.date}-${p.prediction}`,
              title: 'Prediction Completed',
              message: `${p.prediction} (${p.severity})`,
              type: 'primary'
            })
          })

          // Calculate stats
          const totalPredictions = formattedPredictions.length
          const completedPredictions = formattedPredictions.filter(p => p.status === 'Completed' || p.status === 'completed').length
          const underReview = formattedPredictions.filter(p => p.status === 'Under Review' || p.status === 'under_review').length
          const averageConfidence = totalPredictions > 0
            ? Math.round(formattedPredictions.reduce((acc, p) => acc + (p.confidence || 0), 0) / totalPredictions)
            : 0

          setStats({
            totalPredictions,
            averageConfidence,
            completedPredictions,
            underReview
          })
        }
      } catch (error) {
        console.error('Error fetching predictions:', error)
        // Keep empty state on error
        setPredictions([])
        setStats({
          totalPredictions: 0,
          averageConfidence: 0,
          completedPredictions: 0,
          underReview: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

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
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading predictions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Prediction History</h2>
          <p className="text-muted mb-0">View and manage your health predictions</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          const dates = filteredPredictions.map(p => new Date(p.date).toISOString().slice(0, 10))
          dates.forEach((d, i) => {
            setTimeout(() => {
              const url = `${baseUrl}/predictions/pdf?user_id=${encodeURIComponent(user?.id || '')}&date=${encodeURIComponent(d)}`
              window.open(url, '_blank')
            }, i * 400)
          })
        }}>
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
                            onClick={() => setSelected(prediction)}
                          >
                            <FaEye size={12} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Download Report"
                            onClick={() => {
                              const dateParam = new Date(prediction.date).toISOString().slice(0, 10)
                              const url = `${baseUrl}/predictions/pdf?user_id=${encodeURIComponent(prediction.id)}&date=${encodeURIComponent(dateParam)}`
                              window.open(url, '_blank')
                              notificationService.add({
                                title: 'Report Downloaded',
                                message: `${prediction.prediction} report downloaded`,
                                type: 'success'
                              })
                            }}
                          >
                            <FaDownload size={12} />
                          </button
                          >
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
                {filteredPredictions.slice(0, 5).map((p, idx) => (
                  <div className="d-flex mb-3" key={idx}>
                    <div className="bg-primary rounded-circle me-3" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                    <div>
                      <h6 className="mb-1 fw-semibold">Prediction Completed</h6>
                      <small className="text-muted">{new Date(p.date).toLocaleString()} - {p.prediction}</small>
                    </div>
                  </div>
                ))}
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
                <button className="btn btn-primary" onClick={() => { window.location.href = '/predict' }}>
                  <FaSearch className="me-2" />
                  Start New Prediction
                </button>
                <button className="btn btn-outline-primary" onClick={() => {
                  const dates = filteredPredictions.map(p => new Date(p.date).toISOString().slice(0, 10))
                  dates.forEach((d, i) => {
                    setTimeout(() => {
                      const url = `${baseUrl}/predictions/pdf?user_id=${encodeURIComponent(user?.id || '')}&date=${encodeURIComponent(d)}`
                      window.open(url, '_blank')
                      notificationService.add({ title: 'Report Downloaded', message: `Exported report (${d})`, type: 'success' })
                    }, i * 400)
                  })
                }}>
                  <FaDownload className="me-2" />
                  Export All Records
                </button>
                <button className="btn btn-outline-secondary" onClick={() => { window.location.href = '/dashboard/contact-doctor' }}>
                  <FaCalendarAlt className="me-2" />
                  Schedule Follow-up
                </button
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Prediction Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2"><strong>Date:</strong> {new Date(selected.date).toLocaleString()}</div>
                <div className="mb-2"><strong>Prediction:</strong> {selected.prediction}</div>
                <div className="mb-2"><strong>Confidence:</strong> {selected.confidence}%</div>
                <div className="mb-2"><strong>Severity:</strong> {selected.severity}</div>
                <div className="mb-2"><strong>Status:</strong> {selected.status}</div>
                <div className="mb-2"><strong>Doctor:</strong> {selected.doctor}</div>
                <div className="mb-2"><strong>Symptoms:</strong> {selected.symptoms.join(', ')}</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  const dateParam = new Date(selected.date).toISOString().slice(0, 10)
                  const url = `${baseUrl}/predictions/pdf?user_id=${encodeURIComponent(selected.id)}&date=${encodeURIComponent(dateParam)}`
                  window.open(url, '_blank')
                }}>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History