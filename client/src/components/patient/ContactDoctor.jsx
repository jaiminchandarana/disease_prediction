import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'
import {
  FaSearch,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaFilter,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaVideo,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa'

const ContactDoctor = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth?.() || { user: null }
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentType, setAppointmentType] = useState('online')
  const [showFilters, setShowFilters] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)

  const [doctors, setDoctors] = useState([])

  const specialties = ['All Specialties', ...Array.from(new Set(doctors.map(d => d.specialization || d.department).filter(Boolean)))]

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const spec = (doctor.specialization || doctor.department || '').toLowerCase()
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spec.includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'All Specialties' || 
                            spec === selectedSpecialty.toLowerCase()
    return matchesSearch && matchesSpecialty
  })

  // Reset time when date changes or doctor changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedTime('')
      setAvailableSlots([])
    }
  }, [selectedDoctor, selectedDate])

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate('')
    setSelectedTime('')
  }

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please select doctor, date, and time')
      return
    }

    try {
      setLoading(true)
      const stored = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } })()
      const patientName = user?.name || stored?.name || stored?.full_name || 'Patient'
      const params = new URLSearchParams({
        patient_name: patientName,
        doctor_name: selectedDoctor.name,
        department: selectedDoctor.department || selectedDoctor.specialization || 'General',
        date: selectedDate,
        time: selectedTime
      })
      const res = await api.get(`/bookings/create?${params.toString()}`)
      if (res.success) {
        alert(`Appointment booked successfully. Booking ID: ${res.booking_id}`)
        // Reset form
        setSelectedDoctor(null)
        setSelectedDate('')
        setSelectedTime('')
      } else {
        alert(res.error || 'Failed to create booking')
      }
    } catch (e) {
      alert('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Fetch doctors from API
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/doctors')
        if (res.success && mounted) {
          setDoctors(res.doctors || [])
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

  const renderDoctorCard = (doctor) => (
    <div 
      key={doctor.id} 
      className={`card doctor-card mb-3 ${selectedDoctor?.id === doctor.id ? 'border-primary' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={() => handleDoctorSelect(doctor)}
    >
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <div className="doctor-avatar mb-2" style={{ width: '60px', height: '60px' }}>
              {doctor.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <span className={`badge ${doctor.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{doctor.status || 'active'}</span>
            </div>
          </div>
          
          <div className="col-md-6">
            <h6 className="mb-1 fw-bold">{doctor.name}</h6>
            <p className="text-primary mb-1">{doctor.specialization || doctor.department || 'General'}</p>
            <div className="small text-muted mb-1">Department: {doctor.department || '-'}</div>
            <div className="small text-muted mb-1">Qualification: {doctor.qualification || '-'}</div>
            <div className="small text-muted">Experience: {doctor.experience || '-'}</div>
          </div>

          <div className="col-md-4 text-end">
            <div className="mb-2">
              <span className="fw-bold text-success">₹{doctor.consultation_fee || 0}</span>
              <small className="text-muted"> / consultation</small>
            </div>
            <button 
              className={`btn btn-sm ${selectedDoctor?.id === doctor.id ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              {selectedDoctor?.id === doctor.id ? 'Selected' : 'Select Doctor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Contact Doctor</h5>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-1" />
            Filters
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Search and Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by doctor name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="input-group-text">
                <FaSearch />
              </span>
            </div>
          </div>
          
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="bg-light rounded p-3 mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Consultation Type</label>
                <select className="form-select form-select-sm">
                  <option>All Types</option>
                  <option>Online Only</option>
                  <option>In-Person Only</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Rating</label>
                <select className="form-select form-select-sm">
                  <option>All Ratings</option>
                  <option>4.5+ Stars</option>
                  <option>4.0+ Stars</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Experience</label>
                <select className="form-select form-select-sm">
                  <option>All Experience</option>
                  <option>10+ Years</option>
                  <option>15+ Years</option>
                  <option>20+ Years</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Doctors List */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3">Available Doctors ({filteredDoctors.length})</h6>
          
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-4">
              <FaUserMd size={48} className="text-muted mb-3" />
              <p className="text-muted">No doctors found matching your criteria</p>
            </div>
          ) : (
            <div className="doctors-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredDoctors.map(renderDoctorCard)}
            </div>
          )}
        </div>

        {/* Appointment Booking Section */}
        {selectedDoctor && (
          <div className="bg-light rounded p-4">
            <h6 className="fw-bold mb-3">Book Appointment with {selectedDoctor.name}</h6>
            
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Appointment Type</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="appointmentType"
                      id="online"
                      value="online"
                      checked={appointmentType === 'online'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      disabled={!selectedDoctor.isOnline}
                    />
                    <label className="form-check-label" htmlFor="online">
                      <FaVideo className="me-1" />
                      Online
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="appointmentType"
                      id="inperson"
                      value="inperson"
                      checked={appointmentType === 'inperson'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="inperson">
                      <FaPhone className="me-1" />
                      In-Person
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Select Date</label>
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Select Time</label>
                <div className="input-group">
                  <input
                    type="time"
                    className="form-control"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={!selectedDate}
                  />
                  <span className="input-group-text">
                    <FaClock />
                  </span>
                </div>
              </div>
            </div>


            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-bold">Total: ₹{selectedDoctor.consultation_fee || 0}</span>
                {appointmentType === 'online' && (
                  <small className="text-muted d-block">Online consultation fee</small>
                )}
              </div>
              
              <div>
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime || loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="me-2" />
                      Book Appointment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactDoctor