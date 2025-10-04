import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import logo from '../assets/logo.jpg'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)
  const searchRef = useRef(null)

  // Sample notifications - replace with API call later
  const [notifications] = useState([
    {
      id: 1,
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Evelyn Hayes is confirmed for Aug 24',
      time: '2 hours ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'New Message',
      message: 'Dr. Owen Mitchell sent you a message',
      time: '5 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Symptom Check Complete',
      message: 'Your AI symptom analysis is ready to view',
      time: '1 day ago',
      read: true,
      type: 'primary'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  // Sample search data - replace with actual search API later
  const searchableItems = [
    { type: 'page', title: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { type: 'page', title: 'Check Symptoms', path: '/dashboard/check-symptoms', icon: 'symptoms' },
    { type: 'page', title: 'Contact Doctor', path: '/dashboard/contact-doctor', icon: 'doctor' },
    { type: 'page', title: 'Booking Status', path: '/dashboard/booking-status', icon: 'booking' },
    { type: 'page', title: 'Profile', path: '/dashboard/profile', icon: 'profile' },
    { type: 'doctor', title: 'Dr. Evelyn Hayes', subtitle: 'Allergist', path: '/dashboard/contact-doctor' },
    { type: 'doctor', title: 'Dr. Owen Mitchell', subtitle: 'General Practitioner', path: '/dashboard/contact-doctor' },
    { type: 'doctor', title: 'Dr. Chloe Turner', subtitle: 'ENT Specialist', path: '/dashboard/contact-doctor' }
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
    
    if (query.trim().length > 0) {
      const results = searchableItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleSearchResultClick = (path) => {
    navigate(path)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification)
    setShowNotifications(false)
    
    if (notification.type === 'success') {
      navigate('/dashboard/booking-status')
    }
  }

  const handleViewAllNotifications = () => {
    setShowNotifications(false)
    navigate('/history') // Change this to your notifications page route
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const isDashboard = location.pathname.includes('/dashboard') || 
                     location.pathname.includes('/predict') || 
                     location.pathname.includes('/history') || 
                     location.pathname.includes('/profile')

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    const navbarCollapse = document.querySelector('.navbar-collapse')
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
        toggle: false
      })
      bsCollapse.hide()
    }
  }, [location])

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="me-2" style={{ width: '150px', height: 'auto' }} />
        </Link>

        {/* Mobile menu button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Public Navigation */}
          {!isAuthenticated && (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} 
                    to="/about"
                  >
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`} 
                    to="/services"
                  >
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
                    to="/contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>

              <div className="navbar-nav">
                <Link className="btn btn-outline-primary me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary" to="/register">
                  Get Started
                </Link>
              </div>
            </>
          )}

          {/* Authenticated Navigation */}
          {isAuthenticated && (
            <>
              {/* Dashboard Navigation Links */}
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname.includes('/predict') ? 'active' : ''}`} 
                    to="/predict"
                  >
                    Predict
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`} 
                    to="/history"
                  >
                    History
                  </Link>
                </li>
              </ul>

              {/* Search Bar (for dashboard pages) */}
              {isDashboard && (
                <div className="mx-auto d-none d-lg-block position-relative" style={{ maxWidth: '400px', width: '100%' }} ref={searchRef}>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 ps-0" 
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                    />
                    {searchQuery && (
                      <button 
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted border-0 bg-transparent"
                        style={{ zIndex: 10 }}
                        onClick={() => {
                          setSearchQuery('')
                          setShowSearchResults(false)
                        }}
                      >
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg" style={{ maxHeight: '400px', overflowY: 'auto', zIndex: 1000 }}>
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          className="dropdown-item border-0 bg-transparent w-100 text-start py-2 px-3"
                          onClick={() => handleSearchResultClick(result.path)}
                        >
                          <div className="d-flex align-items-center">
                            {result.type === 'doctor' && (
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                {result.title.split(' ')[1][0]}{result.title.split(' ')[2][0]}
                              </div>
                            )}
                            <div>
                              <div className="fw-semibold">{result.title}</div>
                              {result.subtitle && <small className="text-muted">{result.subtitle}</small>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showSearchResults && searchResults.length === 0 && searchQuery && (
                    <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg p-3" style={{ zIndex: 1000 }}>
                      <div className="text-center text-muted">
                        <FaSearch className="mb-2" size={24} />
                        <p className="mb-0 small">No results found for "{searchQuery}"</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Right side items */}
              <ul className="navbar-nav ms-auto">
                {/* Notifications - COMPACT VERSION */}
                <li className="nav-item position-relative" ref={notificationRef}>
                  <button 
                    className="btn btn-link nav-link position-relative border-0 bg-transparent"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FaBell size={18} />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px', padding: '2px 5px' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Compact Notifications Dropdown */}
                  {showNotifications && (
                    <div className="dropdown-menu dropdown-menu-end show position-absolute p-0" style={{ width: '280px', maxHeight: '360px', overflowY: 'auto', right: 0, left: 'auto' }}>
                      <div className="px-3 py-2 border-bottom bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold small">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="badge bg-danger rounded-pill" style={{ fontSize: '10px' }}>{unreadCount}</span>
                          )}
                        </div>
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="text-center py-4">
                          <FaBell size={24} className="text-muted mb-2" />
                          <p className="text-muted small mb-0">No notifications</p>
                        </div>
                      ) : (
                        <div>
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              className={`dropdown-item border-0 bg-transparent w-100 text-start px-3 py-2 ${!notification.read ? 'bg-light' : ''}`}
                              style={{ borderBottom: '1px solid #f0f0f0' }}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="d-flex align-items-start">
                                <div className={`rounded-circle me-2 flex-shrink-0 ${
                                  notification.type === 'success' ? 'bg-success' :
                                  notification.type === 'info' ? 'bg-info' : 'bg-primary'
                                }`} style={{ width: '6px', height: '6px', marginTop: '5px' }}></div>
                                <div className="flex-grow-1 overflow-hidden">
                                  <div className="fw-semibold small text-truncate">{notification.title}</div>
                                  <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>{notification.message}</div>
                                  <div className="text-muted" style={{ fontSize: '10px' }}>{notification.time}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-center border-top">
                        <button 
                          className="btn btn-link text-primary small border-0 bg-transparent w-100 py-2 text-decoration-none" 
                          style={{ fontSize: '11px' }}
                          onClick={handleViewAllNotifications}
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </li>

                {/* User Menu */}
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button 
                    className="btn btn-link nav-link d-flex align-items-center border-0 bg-transparent"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-expanded={showUserMenu}
                  >
                    <div 
                      className="avatar me-2 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                      style={{ width: '32px', height: '32px', fontSize: '14px' }}
                    >
                      {getInitials(user?.name)}
                    </div>
                    <span className="d-none d-md-inline">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="dropdown-menu dropdown-menu-end show position-absolute">
                      <div className="dropdown-header">
                        <small className="text-muted">
                          {user?.role === 'admin' ? 'Administrator' : 
                          user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                        </small>
                        <br />
                        <small>{user?.email}</small>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser className="me-2" />
                        Profile
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item text-danger border-0 bg-transparent w-100 text-start" 
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar