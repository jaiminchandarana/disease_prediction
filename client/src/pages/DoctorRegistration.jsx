import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaHome, 
  FaUserPlus, 
  FaUsers, 
  FaUserCog, 
  FaSignOutAlt,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaUserMd
} from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'

const DoctorRegistration = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [editingDoctor, setEditingDoctor] = useState(null)

  // Sample doctors data - replace with API call
  const [doctors, setDoctors] = useState([
    {
      id: 'DOC001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 234-567-8901',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      qualification: 'MD, FACC',
      experience: '15 years',
      license: 'MD12345',
      status: 'Active',
      joinDate: '2020-01-15',
      consultationFee: '$150'
    },
    {
      id: 'DOC002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      phone: '+1 234-567-8902',
      department: 'Neurology',
      specialization: 'Stroke & Cerebrovascular',
      qualification: 'MD, PhD',
      experience: '12 years',
      license: 'MD12346',
      status: 'Active',
      joinDate: '2021-03-20',
      consultationFee: '$180'
    },
    {
      id: 'DOC003',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      phone: '+1 234-567-8903',
      department: 'Pediatrics',
      specialization: 'Pediatric Oncology',
      qualification: 'MD, FAAP',
      experience: '10 years',
      license: 'MD12347',
      status: 'Active',
      joinDate: '2019-06-10',
      consultationFee: '$120'
    },
    {
      id: 'DOC004',
      name: 'Dr. James Wilson',
      email: 'james.wilson@hospital.com',
      phone: '+1 234-567-8904',
      department: 'Orthopedics',
      specialization: 'Sports Medicine',
      qualification: 'MD, FAAOS',
      experience: '18 years',
      license: 'MD12348',
      status: 'On Leave',
      joinDate: '2018-02-28',
      consultationFee: '$200'
    },
    {
      id: 'DOC005',
      name: 'Dr. Priya Patel',
      email: 'priya.patel@hospital.com',
      phone: '+1 234-567-8905',
      department: 'Dermatology',
      specialization: 'Cosmetic Dermatology',
      qualification: 'MD, FAAD',
      experience: '8 years',
      license: 'MD12349',
      status: 'Active',
      joinDate: '2022-09-15',
      consultationFee: '$130'
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    qualification: '',
    experience: '',
    license: '',
    consultationFee: '',
    status: 'Active'
  })

  const departments = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Oncology',
    'Psychiatry',
    'General Medicine',
    'Surgery'
  ]

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaUserPlus, label: 'Doctor Registration', href: '/dashboard/doctor-registration', active: true },
    { icon: FaUsers, label: 'Patient Bookings', href: '/dashboard/patient-bookings' },
    { icon: FaUserCog, label: 'User Management', href: '#' },
    { icon: FaSignOutAlt, label: 'Logout', href: '#' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingDoctor) {
      // Update existing doctor
      setDoctors(doctors.map(doc => 
        doc.id === editingDoctor.id 
          ? { ...doc, ...formData }
          : doc
      ))
    } else {
      // Add new doctor
      const newDoctor = {
        id: 'DOC' + String(doctors.length + 1).padStart(3, '0'),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0]
      }
      setDoctors([...doctors, newDoctor])
    }
    
    setShowModal(false)
    setEditingDoctor(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      specialization: '',
      qualification: '',
      experience: '',
      license: '',
      consultationFee: '',
      status: 'Active'
    })
  }

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      department: doctor.department,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      license: doctor.license,
      consultationFee: doctor.consultationFee,
      status: doctor.status
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      setDoctors(doctors.filter(doc => doc.id !== id))
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = filterDepartment === 'all' || doctor.department === filterDepartment
    
    return matchesSearch && matchesDepartment
  })

  const closeModal = () => {
    setShowModal(false)
    setEditingDoctor(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      specialization: '',
      qualification: '',
      experience: '',
      license: '',
      consultationFee: '',
      status: 'Active'
    })
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
            <h2 className="fw-bold text-dark mb-1">Doctor Registration</h2>
            <p className="text-muted mb-0">Manage and register doctors in the system</p>
          </div>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Register New Doctor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0">{doctors.length}</div>
                    <div className="text-muted small">Total Doctors</div>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-2 rounded">
                    <FaUserMd className="text-primary" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0">{doctors.filter(d => d.status === 'Active').length}</div>
                    <div className="text-muted small">Active Doctors</div>
                  </div>
                  <div className="bg-success bg-opacity-10 p-2 rounded">
                    <FaUsers className="text-success" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0">{departments.length}</div>
                    <div className="text-muted small">Departments</div>
                  </div>
                  <div className="bg-info bg-opacity-10 p-2 rounded">
                    <FaFilter className="text-info" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-0">{doctors.filter(d => d.status === 'On Leave').length}</div>
                    <div className="text-muted small">On Leave</div>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-2 rounded">
                    <FaUserCog className="text-warning" size={20} />
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
                    placeholder="Search by name, email, department, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select 
                  className="form-select"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Doctor ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="fw-semibold">{doctor.id}</td>
                      <td>
                        <div>
                          <div className="fw-semibold">{doctor.name}</div>
                          <small className="text-muted">{doctor.qualification}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-75 text-white">
                          {doctor.department}
                        </span>
                      </td>
                      <td>{doctor.specialization}</td>
                      <td>
                        <div>
                          <small className="d-block">{doctor.email}</small>
                          <small className="text-muted">{doctor.phone}</small>
                        </div>
                      </td>
                      <td>{doctor.experience}</td>
                      <td>
                        <span className={`badge ${doctor.status === 'Active' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                          {doctor.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(doctor)}
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(doctor.id)}
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
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingDoctor ? 'Edit Doctor' : 'Register New Doctor'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Specialization *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Qualification *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g., MD, MBBS, PhD"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 years"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">License Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Consultation Fee *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      placeholder="e.g., $150"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    {editingDoctor ? 'Update Doctor' : 'Register Doctor'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorRegistration