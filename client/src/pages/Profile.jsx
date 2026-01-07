import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../auth/AuthContext'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adminQuickStats, setAdminQuickStats] = useState({ users: 0, predictions: 0 })
  const [doctorQuickStats, setDoctorQuickStats] = useState({ patients: 0, consultations: 0, licence_no: '' })
  const [doctorProfileInfo, setDoctorProfileInfo] = useState({ specialization: '', experience: '', qualification: '' })
  const [patientQuickStats, setPatientQuickStats] = useState({ predictions: 0, appointments: 0 })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      emergencyContact: user?.emergencyContact || '',
      medicalHistory: user?.medicalHistory || ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUser({ ...user, ...data })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadQuickStats = async () => {
      if (user?.role !== 'admin') return
      const adminToken = localStorage.getItem('token')
      // Doctors (users) under admin
      let usersCount = 0
      try {
        const docs = await api.get(`/auth/get-all-doctors?admin_token=${adminToken}`)
        if (docs.success) usersCount = (docs.doctors || []).length
      } catch {}
      // Predictions: admin self + all doctors under admin
      let predCount = 0
      try {
        const adminPred = await api.get(`/predictions/get?user_id=${adminToken}`)
        if (adminPred.success) predCount += (adminPred.count || adminPred.predictions?.length || 0)
      } catch {}
      try {
        const docs = await api.get(`/auth/get-all-doctors?admin_token=${adminToken}`)
        if (docs.success) {
          for (const d of (docs.doctors || [])) {
            try {
              const res = await api.get(`/predictions/get?user_id=${d.id}`)
              if (res.success) predCount += (res.count || res.predictions?.length || 0)
            } catch {}
          }
        }
      } catch {}
      setAdminQuickStats({ users: usersCount, predictions: predCount })
    }
    loadQuickStats()
  }, [user])

  useEffect(() => {
    const loadDoctorStats = async () => {
      if (user?.role !== 'doctor') return
      const doctorId = user?.id
      // Licence & profile details from doctors list
      try {
        const docs = await api.get('/doctors')
        if (docs.success) {
          const me = (docs.doctors || []).find(d => d.id === doctorId)
          if (me) {
            setDoctorQuickStats(prev => ({ ...prev, licence_no: me.licence_no || '' }))
            setDoctorProfileInfo({
              specialization: me.specialization || '',
              experience: me.experience || '',
              qualification: me.qualification || ''
            })
          }
        }
      } catch {}
      // Bookings for this doctor
      try {
        const b = await api.get('/bookings')
        if (b.success) {
          const mine = (b.bookings || []).filter(x => x.doctor === user.name)
          const patients = new Set(mine.map(x => x.name))
          const consultations = mine.filter(x => (x.status || '').toLowerCase() === 'completed').length
          setDoctorQuickStats(prev => ({ ...prev, patients: patients.size, consultations }))
        }
      } catch {}
    }
    loadDoctorStats()
  }, [user])

  useEffect(() => {
    const loadPatientStats = async () => {
      if (user?.role !== 'patient') return
      const patientId = user?.id
      let predCount = 0
      try {
        const res = await api.get(`/predictions/get?user_id=${patientId}`)
        if (res.success) predCount = res.count || (res.predictions || []).length
      } catch {}
      let apptCount = 0
      try {
        const b = await api.get('/bookings')
        if (b.success) {
          apptCount = (b.bookings || []).filter(x => x.name === user.name).length
        }
      } catch {}
      setPatientQuickStats({ predictions: predCount, appointments: apptCount })
    }
    loadPatientStats()
  }, [user])

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { class: 'bg-danger', text: 'Administrator' },
      doctor: { class: 'bg-primary', text: 'Doctor' },
      patient: { class: 'bg-success', text: 'Patient' }
    }
    return badges[role] || { class: 'bg-secondary', text: 'User' }
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-lg-4">
          {/* Profile Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center p-4">
              <div 
                className="avatar mx-auto mb-3" 
                style={{ width: '120px', height: '120px', fontSize: '3rem' }}
              >
                {getInitials(user?.name)}
              </div>
              <h4 className="fw-bold mb-2">{user?.name}</h4>
              <span className={`badge ${getRoleBadge(user?.role).class} mb-3`}>
                {getRoleBadge(user?.role).text}
              </span>
              <p className="text-muted mb-0">{user?.email}</p>
              
              {user?.role === 'patient' && (
                <div className="mt-3">
                  <small className="text-muted">Patient ID: </small>
                  <span className="fw-semibold">{user?.id || '-'}</span>
                </div>
              )}
              
              {user?.role === 'doctor' && (
                <div className="mt-3">
                  <small className="text-muted">License ID: </small>
                  <span className="fw-semibold">{doctorQuickStats.licence_no || '-'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-bold">Quick Stats</h6>
            </div>
            <div className="card-body">
              {user?.role === 'patient' && (
                <div className="row g-3">
                  <div className="col-6 text-center">
                    <div className="fw-bold text-primary fs-4">{patientQuickStats.predictions}</div>
                    <small className="text-muted">Predictions</small>
                  </div>
                  <div className="col-6 text-center">
                    <div className="fw-bold text-success fs-4">{patientQuickStats.appointments}</div>
                    <small className="text-muted">Appointments</small>
                  </div>
                </div>
              )}
              
              {user?.role === 'doctor' && (
                <div className="row g-3">
                  <div className="col-6 text-center">
                    <div className="fw-bold text-primary fs-4">{doctorQuickStats.patients}</div>
                    <small className="text-muted">Patients</small>
                  </div>
                  <div className="col-6 text-center">
                    <div className="fw-bold text-success fs-4">{doctorQuickStats.consultations}</div>
                    <small className="text-muted">Consultations</small>
                  </div>
                </div>
              )}
              
              {user?.role === 'admin' && (
                <div className="row g-3">
                  <div className="col-6 text-center">
                    <div className="fw-bold text-primary fs-4">{adminQuickStats.users}</div>
                    <small className="text-muted">Users</small>
                  </div>
                  <div className="col-6 text-center">
                    <div className="fw-bold text-success fs-4">{adminQuickStats.predictions}</div>
                    <small className="text-muted">Predictions</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {/* Profile Information */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Profile Information</h5>
                {!isEditing ? (
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={handleSubmit(onSubmit)}
                      disabled={loading}
                    >
                      <FaSave className="me-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancel}
                    >
                      <FaTimes className="me-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-4">
                  {/* Basic Information */}
                  <div className="col-12">
                    <h6 className="fw-bold text-muted mb-3">
                      <FaUser className="me-2" />
                      Basic Information
                    </h6>
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name', { required: 'Name is required' })}
                      />
                    ) : (
                      <div className="form-control-plaintext fw-semibold">{user?.name}</div>
                    )}
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <div className="form-control-plaintext">
                      <FaEnvelope className="me-2 text-muted" />
                      {user?.email}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        {...register('phone', { required: 'Phone is required' })}
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <FaPhone className="me-2 text-muted" />
                        {user?.phone || 'Not provided'}
                      </div>
                    )}
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    {isEditing ? (
                      <select className="form-select" {...register('gender')}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="form-control-plaintext">
                        {user?.gender || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        rows="2"
                        {...register('address')}
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        {user?.address || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {user?.role === 'doctor' && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Specialization</label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Medical specialization"
                            {...register('specialization')}
                          />
                        ) : (
                      <div className="form-control-plaintext">
                        {doctorProfileInfo.specialization || user?.specialization || 'Not specified'}
                      </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Years of Experience</label>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Years of experience"
                            {...register('experience')}
                          />
                        ) : (
                          <div className="form-control-plaintext">
                            {doctorProfileInfo.experience || (user?.experience ? `${user.experience} years` : 'Not specified')}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Qualifications</label>
                        {isEditing ? (
                          <textarea
                            className="form-control"
                            rows="2"
                            placeholder="Medical qualifications and certifications"
                            {...register('qualifications')}
                          />
                        ) : (
                          <div className="form-control-plaintext">
                            {doctorProfileInfo.qualification || user?.qualifications || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Account Settings */}
                <div className="row g-4 mt-4">
                  <div className="col-12">
                    <h6 className="fw-bold text-muted mb-3">Account Settings</h6>
                  </div>
                  
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <h6 className="mb-1 fw-semibold">Change Password</h6>
                        <small className="text-muted">Update your account password</small>
                      </div>
                      <button className="btn btn-outline-primary btn-sm">
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <h6 className="mb-1 fw-semibold">Two-Factor Authentication</h6>
                        <small className="text-muted">Add an extra layer of security</small>
                      </div>
                      <button className="btn btn-outline-success btn-sm">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <h6 className="mb-1 fw-semibold text-danger">Delete Account</h6>
                        <small className="text-muted">Permanently delete your account and data</small>
                      </div>
                      <button className="btn btn-outline-danger btn-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile