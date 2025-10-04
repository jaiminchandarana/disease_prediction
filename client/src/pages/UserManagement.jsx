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
  FaEye,
  FaUserMd,
  FaUser,
  FaUserShield,
  FaLock,
  FaUnlock
} from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'

const UserManagement = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  // Sample users data - replace with API call
  const [users, setUsers] = useState([
    {
      id: 'USR001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 234-567-8901',
      role: 'doctor',
      status: 'Active',
      createdAt: '2020-01-15',
      lastLogin: '2025-10-04 09:30 AM',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology'
    },
    {
      id: 'USR002',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 234-567-8902',
      role: 'patient',
      status: 'Active',
      createdAt: '2023-05-20',
      lastLogin: '2025-10-03 02:15 PM',
      age: 35,
      bloodGroup: 'O+'
    },
    {
      id: 'USR003',
      name: 'Admin User',
      email: 'admin@hospital.com',
      phone: '+1 234-567-8903',
      role: 'admin',
      status: 'Active',
      createdAt: '2020-01-01',
      lastLogin: '2025-10-04 08:00 AM',
      permissions: ['all']
    },
    {
      id: 'USR004',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      phone: '+1 234-567-8904',
      role: 'doctor',
      status: 'Active',
      createdAt: '2021-03-20',
      lastLogin: '2025-10-04 10:00 AM',
      department: 'Neurology',
      specialization: 'Stroke & Cerebrovascular'
    },
    {
      id: 'USR005',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 234-567-8905',
      role: 'patient',
      status: 'Inactive',
      createdAt: '2024-02-10',
      lastLogin: '2025-09-15 03:20 PM',
      age: 28,
      bloodGroup: 'A+'
    },
    {
      id: 'USR006',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      phone: '+1 234-567-8906',
      role: 'doctor',
      status: 'Active',
      createdAt: '2019-06-10',
      lastLogin: '2025-10-03 04:45 PM',
      department: 'Pediatrics',
      specialization: 'Pediatric Oncology'
    },
    {
      id: 'USR007',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 234-567-8907',
      role: 'patient',
      status: 'Active',
      createdAt: '2022-11-05',
      lastLogin: '2025-10-02 11:30 AM',
      age: 42,
      bloodGroup: 'B+'
    },
    {
      id: 'USR008',
      name: 'Support Admin',
      email: 'support@hospital.com',
      phone: '+1 234-567-8908',
      role: 'admin',
      status: 'Active',
      createdAt: '2022-06-15',
      lastLogin: '2025-10-04 07:30 AM',
      permissions: ['users', 'bookings']
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'Active',
    password: '',
    department: '',
    specialization: '',
    age: '',
    bloodGroup: ''
  })

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaUserPlus, label: 'Doctor Registration', href: '/dashboard/doctor-registration' },
    { icon: FaUsers, label: 'Patient Bookings', href: '/dashboard/patient-bookings' },
    { icon: FaUserCog, label: 'User Management', href: '/dashboard/user-management', active: true }
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
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData, password: undefined }
          : u
      ))
    } else {
      // Add new user
      const newUser = {
        id: 'USR' + String(users.length + 1).padStart(3, '0'),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        password: undefined // Don't store password in state
      }
      setUsers([...users, newUser])
    }
    
    closeModal()
  }

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit)
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
      role: userToEdit.role,
      status: userToEdit.status,
      password: '',
      department: userToEdit.department || '',
      specialization: userToEdit.specialization || '',
      age: userToEdit.age || '',
      bloodGroup: userToEdit.bloodGroup || ''
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const handleStatusToggle = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
    ))
  }

  const viewDetails = (userToView) => {
    setSelectedUser(userToView)
    setShowDetailModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'Active',
      password: '',
      department: '',
      specialization: '',
      age: '',
      bloodGroup: ''
    })
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role) => {
    const roleConfig = {
      doctor: { class: 'bg-primary', icon: FaUserMd, label: 'Doctor' },
      patient: { class: 'bg-success', icon: FaUser, label: 'Patient' },
      admin: { class: 'bg-warning', icon: FaUserShield, label: 'Admin' }
    }
    
    const config = roleConfig[role] || { class: 'bg-secondary', icon: FaUser, label: role }
    const Icon = config.icon
    
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        <Icon size={12} /> {config.label}
      </span>
    )
  }

  const stats = {
    total: users.length,
    doctors: users.filter(u => u.role === 'doctor').length,
    patients: users.filter(u => u.role === 'patient').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length
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
              <small className="text-muted">Admin ID: {user?.id || '12345'}</small>
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
            <Link to="#" className="sidebar-item">
              <FaSignOutAlt size={18} />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">User Management</h2>
            <p className="text-muted mb-0">Manage all system users and their permissions</p>
          </div>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number">{stats.total}</div>
                  <div className="stats-label">Total Users</div>
                </div>
                <FaUsers className="text-primary" size={24} />
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number text-primary">{stats.doctors}</div>
                  <div className="stats-label">Doctors</div>
                </div>
                <FaUserMd className="text-primary" size={24} />
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number text-success">{stats.patients}</div>
                  <div className="stats-label">Patients</div>
                </div>
                <FaUser className="text-success" size={24} />
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number text-warning">{stats.admins}</div>
                  <div className="stats-label">Admins</div>
                </div>
                <FaUserShield className="text-warning" size={24} />
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number text-success">{stats.active}</div>
                  <div className="stats-label">Active</div>
                </div>
                <FaUnlock className="text-success" size={24} />
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <div className="stats-card">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="stats-number text-danger">{stats.inactive}</div>
                  <div className="stats-label">Inactive</div>
                </div>
                <FaLock className="text-danger" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="doctor">Doctors</option>
                  <option value="patient">Patients</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id}>
                      <td className="fw-semibold">{userItem.id}</td>
                      <td>
                        <div>
                          <div className="fw-semibold">{userItem.name}</div>
                          <small className="text-muted">{userItem.phone}</small>
                        </div>
                      </td>
                      <td>{userItem.email}</td>
                      <td>{getRoleBadge(userItem.role)}</td>
                      <td>
                        <span className={`badge ${userItem.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                          {userItem.status}
                        </span>
                      </td>
                      <td>
                        <small>{userItem.lastLogin}</small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewDetails(userItem)}
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEdit(userItem)}
                            title="Edit User"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            className={`btn btn-sm ${userItem.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleStatusToggle(userItem.id)}
                            title={userItem.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {userItem.status === 'Active' ? <FaLock size={14} /> : <FaUnlock size={14} />}
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(userItem.id)}
                            title="Delete User"
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
            {filteredUsers.length === 0 && (
              <div className="text-center py-5">
                <FaUsers size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No users found</h5>
                <p className="text-muted">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Edit User' : 'Add New User'}
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
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">{editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
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
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Doctor-specific fields */}
                  {formData.role === 'doctor' && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Specialization</label>
                        <input
                          type="text"
                          className="form-control"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Patient-specific fields */}
                  {formData.role === 'patient' && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Blood Group</label>
                        <select
                          className="form-select"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details - {selectedUser.id}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Basic Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">User ID</label>
                        <div className="fw-semibold">{selectedUser.id}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Name</label>
                        <div className="fw-semibold">{selectedUser.name}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Email</label>
                        <div>{selectedUser.email}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Phone</label>
                        <div>{selectedUser.phone}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Role</label>
                        <div>{getRoleBadge(selectedUser.role)}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Status</label>
                        <div>
                          <span className={`badge ${selectedUser.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                            {selectedUser.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div className="col-12">
                    <h6 className="fw-bold text-primary mb-3">Account Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Created At</label>
                        <div>{selectedUser.createdAt}</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Last Login</label>
                        <div>{selectedUser.lastLogin}</div>
                      </div>
                    </div>
                  </div>

                  {/* Role-specific information */}
                  {selectedUser.role === 'doctor' && (
                    <>
                      <hr />
                      <div className="col-12">
                        <h6 className="fw-bold text-primary mb-3">Professional Information</h6>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Department</label>
                            <div>{selectedUser.department}</div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Specialization</label>
                            <div>{selectedUser.specialization}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedUser.role === 'patient' && (
                    <>
                      <hr />
                      <div className="col-12">
                        <h6 className="fw-bold text-primary mb-3">Medical Information</h6>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Age</label>
                            <div>{selectedUser.age} years</div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Blood Group</label>
                            <div>
                              <span className="badge bg-danger">{selectedUser.bloodGroup}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedUser.role === 'admin' && selectedUser.permissions && (
                    <>
                      <hr />
                      <div className="col-12">
                        <h6 className="fw-bold text-primary mb-3">Permissions</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedUser.permissions.map((permission, idx) => (
                            <span key={idx} className="badge bg-info text-dark">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
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
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEdit(selectedUser)
                  }}
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement