import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { FaUsers, FaUserMd, FaChartLine, FaExclamationTriangle, FaBell, FaDownload, FaSync, FaEye, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'

const AdminAnalytics = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [alertsData, setAlertsData] = useState([])

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedTimeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockData = {
        overview: {
          totalPatients: 1247,
          activeDoctors: 28,
          totalConsultations: 3456,
          avgResponseTime: '2.3 min',
          systemUptime: '99.8%',
          patientSatisfaction: 4.6
        },
        symptoms: {
          trending: [
            { symptom: 'Respiratory Issues', count: 234, change: '+12%' },
            { symptom: 'Headache', count: 189, change: '+5%' },
            { symptom: 'Fatigue', count: 167, change: '+8%' },
            { symptom: 'Fever', count: 145, change: '-3%' },
            { symptom: 'Joint Pain', count: 123, change: '+15%' }
          ],
          predictions: {
            accuracy: 87.4,
            totalPredictions: 2345,
            successfulDiagnoses: 2049
          }
        },
        departments: [
          { name: 'Emergency', load: 78, capacity: 100, status: 'High' },
          { name: 'Cardiology', load: 45, capacity: 60, status: 'Normal' },
          { name: 'Orthopedics', load: 32, capacity: 40, status: 'Normal' },
          { name: 'Neurology', load: 28, capacity: 30, status: 'High' },
          { name: 'Pediatrics', load: 55, capacity: 80, status: 'Normal' }
        ],
        recentActivity: [
          { id: 1, type: 'high_load', message: 'Emergency department at 78% capacity', time: '5 min ago', priority: 'high' },
          { id: 2, type: 'prediction', message: 'AI prediction accuracy improved to 87.4%', time: '15 min ago', priority: 'medium' },
          { id: 3, type: 'doctor_login', message: 'Dr. Sarah Johnson logged in', time: '23 min ago', priority: 'low' },
          { id: 4, type: 'system', message: 'System backup completed successfully', time: '1 hour ago', priority: 'low' },
          { id: 5, type: 'alert', message: 'Unusual spike in respiratory symptoms', time: '2 hours ago', priority: 'high' }
        ]
      }

      const mockAlerts = [
        {
          id: 1,
          type: 'critical',
          title: 'High Emergency Load',
          message: 'Emergency department is at 78% capacity. Consider alerting additional staff.',
          timestamp: new Date(Date.now() - 300000), // 5 min ago
          resolved: false
        },
        {
          id: 2,
          type: 'warning',
          title: 'Respiratory Symptom Surge',
          message: '23% increase in respiratory-related consultations in the last 24 hours.',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          resolved: false
        },
        {
          id: 3,
          type: 'info',
          title: 'Doctor Availability',
          message: 'Dr. Michael Chen will be unavailable tomorrow due to conference.',
          timestamp: new Date(Date.now() - 14400000), // 4 hours ago
          resolved: true
        }
      ]

      setAnalyticsData(mockData)
      setAlertsData(mockAlerts)
      toast.success('Analytics data updated')
    } catch (error) {
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleResolveAlert = (alertId) => {
    setAlertsData(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    )
    toast.success('Alert resolved')
  }

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analyticsData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    toast.success('Analytics data exported')
  }

  if (loading || !analyticsData) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h6 className="text-muted">Loading analytics data...</h6>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <h4 className="fw-bold">System Analytics Dashboard</h4>
          <p className="text-muted">Real-time insights into system performance and healthcare metrics</p>
        </div>
        <div className="col-lg-4">
          <div className="d-flex gap-2">
            <select 
              className="form-select"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="btn btn-outline-primary" onClick={loadAnalyticsData}>
              <FaSync />
            </button>
            <button className="btn btn-primary" onClick={exportData}>
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaUsers className="text-primary mb-2" size={32} />
              <h5 className="fw-bold mb-1">{analyticsData.overview.totalPatients.toLocaleString()}</h5>
              <small className="text-muted">Total Patients</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaUserMd className="text-success mb-2" size={32} />
              <h5 className="fw-bold mb-1">{analyticsData.overview.activeDoctors}</h5>
              <small className="text-muted">Active Doctors</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaChartLine className="text-warning mb-2" size={32} />
              <h5 className="fw-bold mb-1">{analyticsData.overview.totalConsultations.toLocaleString()}</h5>
              <small className="text-muted">Consultations</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2" style={{ fontSize: '32px' }}>⏱️</div>
              <h5 className="fw-bold mb-1">{analyticsData.overview.avgResponseTime}</h5>
              <small className="text-muted">Avg Response</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2" style={{ fontSize: '32px' }}>⚡</div>
              <h5 className="fw-bold mb-1">{analyticsData.overview.systemUptime}</h5>
              <small className="text-muted">System Uptime</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2" style={{ fontSize: '32px' }}>⭐</div>
              <h5 className="fw-bold mb-1">{analyticsData.overview.patientSatisfaction}</h5>
              <small className="text-muted">Satisfaction</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Trending Symptoms */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <FaSearch className="me-2" />
                Trending Symptoms
              </h6>
            </div>
            <div className="card-body">
              {analyticsData.symptoms.trending.map((symptom, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="fw-semibold">{symptom.symptom}</span>
                    <br />
                    <small className="text-muted">{symptom.count} cases</small>
                  </div>
                  <span className={`badge ${symptom.change.startsWith('+') ? 'bg-success' : 'bg-danger'}`}>
                    {symptom.change}
                  </span>
                </div>
              ))}
              
              <div className="border-top pt-3 mt-3">
                <div className="row text-center">
                  <div className="col-4">
                    <h6 className="fw-bold text-success">{analyticsData.symptoms.predictions.accuracy}%</h6>
                    <small className="text-muted">AI Accuracy</small>
                  </div>
                  <div className="col-4">
                    <h6 className="fw-bold">{analyticsData.symptoms.predictions.totalPredictions}</h6>
                    <small className="text-muted">Total Predictions</small>
                  </div>
                  <div className="col-4">
                    <h6 className="fw-bold text-primary">{analyticsData.symptoms.predictions.successfulDiagnoses}</h6>
                    <small className="text-muted">Successful</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Load */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <FaChartLine className="me-2" />
                Department Load
              </h6>
            </div>
            <div className="card-body">
              {analyticsData.departments.map((dept, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold">{dept.name}</span>
                    <span className={`badge ${
                      dept.status === 'High' ? 'bg-danger' : 'bg-success'
                    }`}>
                      {dept.status}
                    </span>
                  </div>
                  <div className="progress mb-1" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${
                        dept.load / dept.capacity > 0.7 ? 'bg-danger' :
                        dept.load / dept.capacity > 0.5 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${(dept.load / dept.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    {dept.load}/{dept.capacity} capacity ({Math.round((dept.load / dept.capacity) * 100)}%)
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {/* Alerts */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <FaBell className="me-2" />
                System Alerts
              </h6>
            </div>
            <div className="card-body">
              {alertsData.filter(alert => !alert.resolved).length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <FaBell size={32} className="mb-2 opacity-50" />
                  <p className="mb-0">No active alerts</p>
                </div>
              ) : (
                alertsData.filter(alert => !alert.resolved).map((alert) => (
                  <div key={alert.id} className={`alert alert-${
                    alert.type === 'critical' ? 'danger' :
                    alert.type === 'warning' ? 'warning' : 'info'
                  } d-flex justify-content-between align-items-start`}>
                    <div className="flex-grow-1">
                      <h6 className="alert-heading mb-1">{alert.title}</h6>
                      <p className="mb-1 small">{alert.message}</p>
                      <small className="text-muted">{alert.timestamp.toLocaleString()}</small>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Resolve
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h6 className="fw-bold mb-0">
                <FaEye className="me-2" />
                Recent Activity
              </h6>
            </div>
            <div className="card-body">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="d-flex align-items-start mb-3">
                  <div className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${
                    activity.priority === 'high' ? 'bg-danger' :
                    activity.priority === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} style={{ width: '8px', height: '8px', minWidth: '8px' }}>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1 small">{activity.message}</p>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics