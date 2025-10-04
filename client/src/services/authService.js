import api from './api'

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response
    } catch (error) {
      throw error
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response
    } catch (error) {
      throw error
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh')
      return response
    } catch (error) {
      throw error
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on server, we'll clear local storage
      console.error('Logout error:', error)
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response
    } catch (error) {
      throw error
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response
    } catch (error) {
      throw error
    }
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
      return response
    } catch (error) {
      throw error
    }
  }
}