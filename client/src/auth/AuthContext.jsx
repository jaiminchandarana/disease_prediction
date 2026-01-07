import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          
          // Verify token is still valid by fetching current user
          try {
            const response = await authService.getCurrentUser()
            if (response.success) {
              setUser(response.user)
              setIsAuthenticated(true)
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setUser(null)
              setIsAuthenticated(false)
            }
          } catch (error) {
            // Token expired or invalid
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)

      // Call actual API
      const response = await authService.login(credentials)
      
      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        toast.success(`Welcome ${response.user.name}!`)
        return { success: true }
      } else {
        toast.error(response.error || 'Login failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      
      const response = await authService.register(userData)
      
      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        toast.success('Registration successful!')
        return { success: true }
      } else {
        toast.error(response.error || 'Registration failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true)
      
      const response = await authService.updateProfile(updatedData)
      
      if (response.success) {
        setUser(response.user)
        toast.success('Profile updated successfully')
        return { success: true }
      } else {
        toast.error(response.error || 'Update failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error.response?.data?.error || 'Failed to update profile'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      
      const response = await authService.changePassword(currentPassword, newPassword)
      
      if (response.success) {
        toast.success('Password changed successfully')
        return { success: true }
      } else {
        toast.error(response.error || 'Password change failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Change password error:', error)
      const errorMessage = error.response?.data?.error || 'Failed to change password'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}