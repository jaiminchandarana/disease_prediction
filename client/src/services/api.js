import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://disease-prediction-3z87.onrender.com/api' : 'http://localhost:5000/api'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong'

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      // Convert to query parameters for GET request
      const params = new URLSearchParams({
        identifier: credentials.identifier,
        password: credentials.password,
        role: credentials.role
      })
      const response = await api.get(`/auth/login?${params}`)
      if (response.success && response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      return response
    } catch (error) {
      throw error
    }
  },

  // Get predictions for current user
  getPredictions: async () => {
    try {
      const storedUser = localStorage.getItem('user')
      const user = storedUser ? JSON.parse(storedUser) : null
      const userId = user?.id || localStorage.getItem('token')
      if (!userId) {
        throw new Error('No user id found')
      }
      const response = await api.get(`/predictions/get?user_id=${encodeURIComponent(userId)}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Register user
  register: async (userData) => {
    try {
      // Convert to query parameters for GET request
      const params = new URLSearchParams({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        phone: userData.phone,
        role: userData.role
      })
      const response = await api.get(`/auth/register?${params}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const response = await api.get(`/auth/me?token=${token}`)
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      return response
    } catch (error) {
      throw error
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await api.put('/auth/change-password', {
        userId: user.id,
        currentPassword,
        newPassword
      })
      return response
    } catch (error) {
      throw error
    }
  },

  sendOtp: async (email) => {
    try {
      const response = await api.post('/auth/send-otp', { email })
      return response
    } catch (error) {
      throw error
    }
  },

  resetPasswordOtp: async (email, otp, newPassword) => {
    try {
      const response = await api.put('/auth/reset-password-otp', { email, otp, newPassword })
      return response
    } catch (error) {
      throw error
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      if (response.success) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...response.user }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      return response
    } catch (error) {
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Get stored user
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  }
}

export default api

// Lightweight notifications service using localStorage (no backend changes)
export const notificationService = {
  storageKey: 'notifications',
  getAll: (currentUser) => {
    try {
      const raw = localStorage.getItem('notifications')
      const list = raw ? JSON.parse(raw) : []
      if (!currentUser) return []

      return list.filter(n => {
        // 1. Basic check: if notification has a specific userId, match it
        if (n.userId && n.userId === currentUser.id) return true

        // 2. Admin check: if current user is admin, show notifications from their doctors (tagged with adminId)
        if (currentUser.role === 'admin' && n.adminId === currentUser.id) return true

        return false
      })
    } catch {
      return []
    }
  },
  saveAll: (list) => {
    try {
      localStorage.setItem('notifications', JSON.stringify(list))
    } catch { }
  },
  add: (notification) => {
    // notification object should include { userId, adminId, ... }
    const raw = localStorage.getItem('notifications')
    const list = raw ? JSON.parse(raw) : []

    // Check for duplicates
    const exists = list.some(n => n.key && n.key === notification.key)

    if (!exists) {
      const newItem = {
        id: Date.now(),
        read: false,
        time: new Date().toISOString(),
        ...notification
      }
      // Add to beginning, limit to 500 to prevent overflow
      const updatedList = [newItem, ...list].slice(0, 500)
      notificationService.saveAll(updatedList)
      return updatedList
    }
    return list
  },
  markAllRead: (currentUser) => {
    // Only mark visible notifications as read
    const raw = localStorage.getItem('notifications')
    const list = raw ? JSON.parse(raw) : []

    const updatedList = list.map(n => {
      let isVisible = false
      if (n.userId && n.userId === currentUser?.id) isVisible = true
      if (currentUser?.role === 'admin' && n.adminId === currentUser?.id) isVisible = true

      if (isVisible) return { ...n, read: true }
      return n
    })

    notificationService.saveAll(updatedList)
    return updatedList
  }
}