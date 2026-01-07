import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://disease-prediction-3z87.onrender.com/api' : 'http://localhost:5000/api'),
  timeout: 10000,
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
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
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
  getAll: () => {
    try {
      const raw = localStorage.getItem('notifications')
      const list = raw ? JSON.parse(raw) : []
      return Array.isArray(list) ? list : []
    } catch {
      return []
    }
  },
  saveAll: (list) => {
    try {
      localStorage.setItem('notifications', JSON.stringify(list))
    } catch {}
  },
  add: (notification) => {
    const list = notificationService.getAll()
    const exists = list.some(n => n.key && n.key === notification.key)
    const toSave = exists ? list : [{ id: Date.now(), read: false, time: new Date().toISOString(), ...notification }, ...list].slice(0, 100)
    notificationService.saveAll(toSave)
    return toSave
  },
  markAllRead: () => {
    const list = notificationService.getAll().map(n => ({ ...n, read: true }))
    notificationService.saveAll(list)
    return list
  }
}