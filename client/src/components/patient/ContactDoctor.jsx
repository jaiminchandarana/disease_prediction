import React, { useState, useEffect } from 'react'
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
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentType, setAppointmentType] = useState('online')
  const [showFilters, setShowFilters] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)

  // Sample doctors data
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Evelyn Hayes',
      specialty: 'Allergist',
      avatar: 'EH',
      rating: 4.9,
      reviews: 245,
      experience: '15+ years',
      location: 'New York Medical Center',
      consultationFee: 150,
      languages: ['English', 'Spanish'],
      availability: {
        '2025-08-24': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        '2025-08-25': ['09:00', '10:30', '14:00', '16:00'],
        '2025-08-26': ['10:00', '11:00', '15:00', '16:00']
      },
      nextAvailable: '2025-08-24',
      isOnline: true
    },
    {
      id: 2,
      name: 'Dr. Owen Mitchell',
      specialty: 'General Practitioner',
      avatar: 'OM',
      rating: 4.7,
      reviews: 189,
      experience: '12+ years',
      location: 'Downtown Health Clinic',
      consultationFee: 120,
      languages: ['English', 'French'],
      availability: {
        '2025-08-24': ['08:00', '09:00', '13:00', '14:00'],
        '2025-08-25': ['08:30', '10:00', '15:00', '16:30'],
        '2025-08-27': ['09:00', '10:00', '11:00', '14:00']
      },
      nextAvailable: '2025-08-24',
      isOnline: false
    },
    {
      id: 3,
      name: 'Dr. Chloe Turner',
      specialty: 'ENT Specialist',
      avatar: 'CT',
      rating: 4.8,
      reviews: 312,
      experience: '18+ years',
      location: 'Specialized ENT Care',
      consultationFee: 180,
      languages: ['English', 'German'],
      availability: {
        '2025-08-25': ['09:00', '10:00', '14:00', '15:00'],
        '2025-08-26': ['08:00', '11:00', '16:00'],
        '2025-08-27': ['10:00', '14:00', '15:00']
      },
      nextAvailable: '2025-08-25',
      isOnline: true
    },
    {
      id: 4,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      avatar: 'SJ',
      rating: 4.9,
      reviews: 198,
      experience: '20+ years',
      location: 'Heart Care Institute',
      consultationFee: 200,
      languages: ['English'],
      availability: {
        '2025-08-26': ['09:00', '10:00', '14:00'],
        '2025-08-27': ['08:00', '15:00', '16:00'],
        '2025-08-28': ['09:00', '11:00', '14:00']
      },
      nextAvailable: '2025-08-26',
      isOnline: true
    }
  ])

  const specialties = ['All Specialties', 'Allergist', 'General Practitioner', 'ENT Specialist', 'Cardiologist', 'Dermatologist', 'Neurologist']

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'All Specialties' || 
                            doctor.specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  // Get available time slots for selected doctor and date
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const doctor = doctors.find(d => d.id === selectedDoctor.id)
      const slots = doctor?.availability[selectedDate] || []
      setAvailableSlots(slots)
      setSelectedTime('') // Reset time selection
    }
  }, [selectedDoctor, selectedDate, doctors])

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

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      alert(`Appointment booked successfully with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`)
      setLoading(false)
      // Reset form
      setSelectedDoctor(null)
      setSelectedDate('')
      setSelectedTime('')
    }, 2000)
  }

  const getAvailableDates = (doctor) => {
    const dates = Object.keys(doctor.availability)
    const today = new Date().toISOString().split('T')[0]
    return dates.filter(date => date >= today)
  }

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
              {doctor.avatar}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {doctor.isOnline && (
                <span className="badge bg-success">Online</span>
              )}
            </div>
          </div>
          
          <div className="col-md-6">
            <h6 className="mb-1 fw-bold">{doctor.name}</h6>
            <p className="text-primary mb-1">{doctor.specialty}</p>
            <div className="d-flex align-items-center mb-1">
              <FaStar className="text-warning me-1" size={14} />
              <span className="small me-2">{doctor.rating}</span>
              <span className="text-muted small">({doctor.reviews} reviews)</span>
            </div>
            <div className="d-flex align-items-center mb-1">
              <FaMapMarkerAlt className="text-muted me-1" size={12} />
              <span className="small text-muted">{doctor.location}</span>
            </div>
            <div className="small text-muted">
              Languages: {doctor.languages.join(', ')}
            </div>
          </div>

          <div className="col-md-4 text-end">
            <div className="mb-2">
              <span className="fw-bold text-success">${doctor.consultationFee}</span>
              <small className="text-muted"> / consultation</small>
            </div>
            <div className="mb-2">
              <small className="text-muted">Next available:</small><br />
              <small className="fw-semibold">{new Date(doctor.nextAvailable).toLocaleDateString()}</small>
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
                  <select
                    className="form-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates(selectedDoctor).map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </option>
                    ))}
                  </select>
                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Select Time</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={!selectedDate}
                  >
                    <option value="">Choose a time</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <span className="input-group-text">
                    <FaClock />
                  </span>
                </div>
              </div>
            </div>

            {selectedDate && availableSlots.length === 0 && (
              <div className="alert alert-warning">
                <FaTimes className="me-2" />
                No available slots for this date. Please select another date.
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-bold">Total: ${selectedDoctor.consultationFee}</span>
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
                  disabled={!selectedDate || !selectedTime || availableSlots.length === 0 || loading}
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