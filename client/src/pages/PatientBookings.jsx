import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaHome, 
  FaUserPlus, 
  FaUsers, 
  FaUserCog, 
  FaSignOutAlt,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFilter
} from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'

const PatientBookings = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Sample bookings data - replace with API call
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      patientId: 'PAT001',
      patientName: 'John Smith',
      patientEmail: 'john.smith@email.com',
      patientPhone: '+1 234-567-8901',
      age: 35,
      gender: 'Male',
      doctorId: 'DOC001',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      appointmentDate: '2025-10-15',
      appointmentTime: '10:00 AM',
      bookingDate: '2025-10-05',
      symptoms: 'Chest pain, shortness of breath',
      status: 'Confirmed',
      notes: 'Follow-up appointment for cardiac evaluation'
    },
    {
      id: 'BK002',
      patientId: 'PAT002',
      patientName: 'Emily Davis',
      patientEmail: 'emily.davis@email.com',
      patientPhone: '+1 234-567-8902',
      age: 28,
      gender: 'Female',
      doctorId: 'DOC002',
      doctorName: 'Dr. Michael Chen',
      department: 'Neurology',
      appointmentDate: '2025-10-16',
      appointmentTime: '2:00 PM',
      bookingDate: '2025-10-04',
      symptoms: 'Persistent headaches, dizziness',
      status: 'Pending',
      notes: 'New patient consultation'
    },
    {
      id: 'BK003',
      patientId: 'PAT003',
      patientName: 'Michael Brown',
      patientEmail: 'michael.brown@email.com',
      patientPhone: '+1 234-567-8903',
      age: 42,
      gender: 'Male',
      doctorId: 'DOC003',
      doctorName: 'Dr. Emily Rodriguez',
      department: 'Pediatrics',
      appointmentDate: '2025-10-12',
      appointmentTime: '11:00 AM',
      bookingDate: '2025-10-02',
      symptoms: 'Child fever and cough',
      status: 'Completed',
      notes: 'Pediatric examination for 5-year-old child'
    },
    {
      id: 'BK004',
      patientId: 'PAT004',
      patientName: 'Sarah Wilson',
      patientEmail: 'sarah.wilson@email.com',
      patientPhone: '+1 234-567-8904',
      age: 31,
      gender: 'Female',
      doctorId: 'DOC004',
      doctorName: 'Dr. James Wilson',
      department: 'Orthopedics',
      appointmentDate: '2025-10-18',
      appointmentTime: '3:00 PM',
      bookingDate: '2025-10-06',
      symptoms: 'Knee pain after sports injury',
      status: 'Confirmed',
      notes: 'Sports injury evaluation'
    },
    {
      id: 'BK005',
      patientId: 'PAT005',
      patientName: 'David Martinez',
      patientEmail: 'david.martinez@email.com',
      patientPhone: '+1 234-567-8905',
      age: 55,
      gender: 'Male',
      doctorId: 'DOC005',
      doctorName: 'Dr. Priya Patel',
      department: 'Dermatology',
      appointmentDate: '2025-10-20',
      appointmentTime: '4:00 PM',
      bookingDate: '2025-10-07',
      symptoms: 'Skin rash, itching',
      status: 'Cancelled',
      notes: 'Patient requested cancellation'
    }
  ])

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaUserPlus, label: 'Doctor Registration', href: '/dashboard/doctor-registration' },
    { icon: FaUsers, label: 'Patient Bookings', href: '/dashboard/patient-bookings', active: true },
    { icon: FaUserCog, label: 'User Management', href: '#' },
    { icon: FaSignOutAlt, label: 'Logout', href: '#' }
  ]

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(booking => booking.id !== id))
    }
  }

  const viewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const departmentColors = {
    Cardiology: 'bg-primary text-white',
    Neurology: 'bg-info text-white',
    Pediatrics: 'bg-success text-white',
    Orthopedics: 'bg-warning text-dark',
    Dermatology: 'bg-secondary text-white'
  }

  const getDepartmentBadge = (department) => {
    const colorClass = departmentColors[department] || 'bg-light text-dark border';
    return (
      <span className={`badge ${colorClass}`}>
        {department}
      </span>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Confirmed': { class: 'bg-success text-white', icon: FaCheckCircle },
      'Pending': { class: 'bg-warning text-dark', icon: FaClock },
      'Completed': { class: 'bg-info text-white', icon: FaCheckCircle },
      'Cancelled': { class: 'bg-danger text-white', icon: FaTimesCircle }
    }
    const config = statusConfig[status] || { class: 'bg-secondary text-white', icon: FaClock }
    const Icon = config.icon
    return (
      <span className={`badge d-flex align-items-center gap-1 ${config.class}`}>
        <Icon size={14} className="me-1" /> {status}
      </span>
    )
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length
  }

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
              <small className="text-muted">Admin ID: 12345</small>
              <div><small className="text-muted">{user?.email}</small></div>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Patient Bookings</h2>
            <p className="text-muted mb-0">Manage all patient appointments and bookings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0">{stats.total}</div>
                    <div className="text-muted small">Total Bookings</div>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-2 rounded">
                    <FaUsers className="text-primary" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0 text-success">{stats.confirmed}</div>
                    <div className="text-muted small">Confirmed</div>
                  </div>
                  <div className="bg-success bg-opacity-10 p-2 rounded">
                    <FaCheckCircle className="text-success" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0 text-warning">{stats.pending}</div>
                    <div className="text-muted small">Pending</div>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-2 rounded">
                    <FaClock className="text-warning" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0 text-info">{stats.completed}</div>
                    <div className="text-muted small">Completed</div>
                  </div>
                  <div className="bg-info bg-opacity-10 p-2 rounded">
                    <FaCheckCircle className="text-info" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0 text-danger">{stats.cancelled}</div>
                    <div className="text-muted small">Cancelled</div>
                  </div>
                  <div className="bg-danger bg-opacity-10 p-2 rounded">
                    <FaTimesCircle className="text-danger" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by patient name, doctor, booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select 
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Appointment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="fw-semibold">{booking.id}</td>
                      <td>
                        <div>
                          <div className="fw-semibold">{booking.patientName}</div>
                          <small className="text-muted">{booking.patientEmail}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">{booking.doctorName}</div>
                          <small className="text-muted">{booking.doctorId}</small>
                        </div>
                      </td>
                      <td>
                        {getDepartmentBadge(booking.department)}
                      </td>
                      <td>
                        <div>
                          <div>{booking.appointmentDate}</div>
                          <small className="text-muted">{booking.appointmentTime}</small>
                        </div>
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewDetails(booking)}
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <FaEdit size={14} />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(booking.id, 'Confirmed')}
                                >
                                  Mark as Confirmed
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(booking.id, 'Completed')}
                                >
                                  Mark as Completed
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                                >
                                  Mark as Cancelled
                                </button>
                              </li>
                            </ul>
                          </div>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(booking.id)}
                            title="Delete Booking"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredBookings.length === 0 && (
              <div className="text-center py-5">
                <FaCalendarCheck size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No bookings found</h5>
                <p className="text-muted">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details - {selectedBooking.id}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  {/* Patient Information */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Patient Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Patient ID</label>
                        <div className="fw-semibold">{selectedBooking.patientId}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Name</label>
                        <div className="fw-semibold">{selectedBooking.patientName}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Email</label>
                        <div>{selectedBooking.patientEmail}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Phone</label>
                        <div>{selectedBooking.patientPhone}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Age</label>
                        <div>{selectedBooking.age} years</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Gender</label>
                        <div>{selectedBooking.gender}</div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Doctor & Appointment Information */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Appointment Details</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Doctor</label>
                        <div className="fw-semibold">{selectedBooking.doctorName}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Department</label>
                        <div>
                          <span className="badge bg-primary">
                            {selectedBooking.department}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Appointment Date</label>
                        <div className="fw-semibold">{selectedBooking.appointmentDate}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Appointment Time</label>
                        <div className="fw-semibold">{selectedBooking.appointmentTime}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Booking Date</label>
                        <div>{selectedBooking.bookingDate}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Status</label>
                        <div>{getStatusBadge(selectedBooking.status)}</div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Symptoms & Notes */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Medical Information</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label text-muted small">Symptoms</label>
                        <div className="p-3 bg-light rounded">
                          {selectedBooking.symptoms}
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small">Notes</label>
                        <div className="p-3 bg-light rounded">
                          {selectedBooking.notes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
                <div className="dropdown">
                  <button 
                    className="btn btn-primary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    Change Status
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, 'Confirmed')
                          setShowDetailModal(false)
                        }}
                      >
                        Mark as Confirmed
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, 'Completed')
                          setShowDetailModal(false)
                        }}
                      >
                        Mark as Completed
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, 'Cancelled')
                          setShowDetailModal(false)
                        }}
                      >
                        Mark as Cancelled
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientBookings