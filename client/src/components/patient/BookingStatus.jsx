import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaCalendarAlt,
  FaVideo,
  FaPhone,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa'
import { useAuth } from '../../auth/AuthContext'
import api from '../../services/api'

const BookingStatus = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [filterStatus, setFilterStatus] = useState('all')

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [rescheduleFor, setRescheduleFor] = useState(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/bookings')
        if (res.success && mounted) {
          const data = (res.bookings || [])
            .filter(b => b.name === (user?.name || ''))
            .map(b => {
            const dt = b.appointment ? new Date(b.appointment) : null
            return {
              id: b.booking_id,
              name: b.name,
              doctor: b.doctor,
              department: b.department,
              date: dt ? dt.toISOString().slice(0,10) : '-',
              time: dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
              status: (b.status || 'pending').toLowerCase(),
              avatar: (b.doctor || '').split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'
            }
          })
          setAppointments(data)
        }
      } catch (e) {
        // no-op
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const sidebarItems = [
    { 
      icon: FaClipboardList, 
      label: 'Predictions', 
      href: '/dashboard'
    },
    { 
      icon: FaUsers, 
      label: 'Contact Doctor', 
      href: '/dashboard/contact-doctor'
    },
    { 
      icon: FaCalendarAlt, 
      label: 'Booking Status', 
      href: '/dashboard/booking-status',
      active: true
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success"><FaCheckCircle className="me-1" />Confirmed</span>
      case 'pending':
        return <span className="badge bg-warning"><FaClock className="me-1" />Pending</span>
      case 'completed':
        return <span className="badge bg-primary"><FaCheckCircle className="me-1" />Completed</span>
      case 'cancelled':
        return <span className="badge bg-danger"><FaTimes className="me-1" />Cancelled</span>
      default:
        return <span className="badge bg-secondary">Unknown</span>
    }
  }

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus
  )

  const handleReschedule = (id) => {
    setRescheduleFor(id)
    setNewDate('')
    setNewTime('')
  }

  const handleSaveReschedule = async (id) => {
    if (!newDate || !newTime) return
    try {
      await api.get(`/bookings/update-appointment?booking_id=${id}&date=${newDate}&time=${newTime}`)
      setAppointments(prev => prev.map(a => a.id === id ? {
        ...a,
        date: newDate,
        time: newTime,
        status: 'pending'
      } : a))
      setRescheduleFor(null)
      setNewDate('')
      setNewTime('')
    } catch (e) {
      // no-op
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      await api.get(`/bookings/update-status?booking_id=${id}&status=cancelled`)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch (e) {
      // no-op
    }
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

  const handleBookNewAppointment = () => {
    navigate('/dashboard/contact-doctor')
  }

  const handleViewAllHistory = () => {
    navigate('/history')
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
            <h2 className="fw-bold text-dark">Booking Status</h2>
            <p className="text-muted mb-0">Manage your appointments</p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleViewAllHistory}
            >
              View All History
            </button>
            <Link to="/dashboard/contact-doctor" className="btn btn-primary">
              <FaCalendarAlt className="me-2" />
              Book New Appointment
            </Link>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            {/* Status Filter */}
            <div className="row g-2 mb-4">
              <div className="col-6 col-md-3">
                <button 
                  className={`btn w-100 btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({appointments.length})
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button 
                  className={`btn w-100 btn-sm ${filterStatus === 'confirmed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilterStatus('confirmed')}
                >
                  Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button 
                  className={`btn w-100 btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending ({appointments.filter(a => a.status === 'pending').length})
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button 
                  className={`btn w-100 btn-sm ${filterStatus === 'completed' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setFilterStatus('completed')}
                >
                  Completed ({appointments.filter(a => a.status === 'completed').length})
                </button>
              </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-5">
                <FaCalendarAlt size={48} className="text-muted mb-3" />
                <h5 className="text-muted mb-2">No appointments found</h5>
                <p className="text-muted mb-3">
                  {filterStatus === 'all' 
                    ? "You don't have any appointments yet." 
                    : `No ${filterStatus} appointments found.`}
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={handleBookNewAppointment}
                >
                  <FaCalendarAlt className="me-2" />
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="card mb-3 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <div className="doctor-avatar mb-2" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                          {appointment.avatar}
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="col-md-6">
                        <h6 className="mb-1 fw-bold">{appointment.doctor}</h6>
                        <p className="text-primary mb-1 small">Department: {appointment.department}</p>
                        
                        <div className="d-flex align-items-center mb-1">
                          <FaCalendarAlt className="text-muted me-1" size={12} />
                          <span className="small me-3">{appointment.date}</span>
                          <FaClock className="text-muted me-1" size={12} />
                          <span className="small">{appointment.time}</span>
                        </div>

                        <div className="small text-muted">
                          Booking ID: {appointment.id} • Name: {appointment.name}
                        </div>
                      </div>

                      <div className="col-md-4 text-end">
                        {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                          <div className="btn-group-vertical d-grid gap-1">
                            <button 
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleReschedule(appointment.id)}
                            >
                              <FaEdit className="me-1" /> Reschedule
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              <FaTrash className="me-1" /> Cancel
                            </button>
                          </div>
                        )}
                        {rescheduleFor === appointment.id && (
                          <div className="mt-2">
                            <div className="input-group input-group-sm mb-2">
                              <input type="date" className="form-control" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                              <input type="time" className="form-control" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                              <button className="btn btn-sm btn-secondary" onClick={() => setRescheduleFor(null)}>Close</button>
                              <button className="btn btn-sm btn-primary" onClick={() => handleSaveReschedule(appointment.id)}>Save</button>
                            </div>
                          </div>
                        )}
                        {appointment.status === 'completed' && (
                          <button className="btn btn-outline-primary btn-sm" onClick={() => {
                            const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                            const token = localStorage.getItem('token')
                            if (token) window.open(`${base}/predictions/pdf?user_id=${token}`, '_blank')
                          }}>
                            View Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingStatus