import api from './api'

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
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch (error) {
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
  },

  // Register doctor (Admin only)
  registerDoctor: async (doctorData) => {
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('token')
      if (!adminToken) {
        throw new Error('Not authenticated')
      }

      // Convert to query parameters for GET request
      const params = new URLSearchParams({
        admin_token: adminToken,
        name: doctorData.name,
        email: doctorData.email,
        password: doctorData.password,
        address: doctorData.address,
        phone: doctorData.phone,
        department: doctorData.department || '',
        specialization: doctorData.specialization || '',
        qualification: doctorData.qualification || '',
        experience: doctorData.experience || '',
        licence_no: doctorData.licence_no || '',
        consultation_fee: doctorData.consultation_fee || '',
        status: doctorData.status || 'active'
      })
      
      const response = await api.get(`/auth/register-doctor?${params}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get all doctors (Admin only)
  getAllDoctors: async () => {
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('token')
      if (!adminToken) {
        throw new Error('Not authenticated')
      }

      const response = await api.get(`/auth/get-all-doctors?admin_token=${adminToken}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Predict disease from Q&A
  predictDisease: async (qnaData) => {
    try {
      // Convert Q&A data to query parameters
      const params = new URLSearchParams()
      params.append('qna', JSON.stringify(qnaData))
      
      const response = await api.get(`/predict?${params}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Save prediction to database
  savePrediction: async (predictionData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const params = new URLSearchParams({
        user_id: token,
        predicted_disease: predictionData.disease,
        symptoms: predictionData.symptoms,
        severity: predictionData.severity,
        doctor_name: predictionData.doctor_name || '',
        confidence: predictionData.confidence || '70'
      })

      const response = await api.get(`/predictions/save?${params}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Get all predictions for current user
  getPredictions: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await api.get(`/predictions/get?user_id=${token}`)
      return response
    } catch (error) {
      throw error
    }
  }
}