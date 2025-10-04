import React, { createContext, useState, useContext, useEffect } from 'react'

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
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null)
        setIsAuthenticated(false)
        // Clear invalid data
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

      // This is where you would normally make an API call
      // For now, we'll use the dummy authentication logic
      
      if (credentials.user && credentials.token) {
        // Direct login with user data (used by dummy login)
        localStorage.setItem('token', credentials.token)
        localStorage.setItem('user', JSON.stringify(credentials.user))
        setUser(credentials.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        // Normal login flow with email/password
        // You would replace this with your actual API call
        const response = await mockApiLogin(credentials)
        
        if (response.success) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          setUser(response.user)
          setIsAuthenticated(true)
          return { success: true }
        } else {
          return { success: false, error: response.error }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      
      // You would replace this with your actual API call
      const response = await mockApiRegister(userData)
      
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      setLoading(false)
    }
  }

  // Mock API functions (replace these with real API calls)
  const mockApiLogin = async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Dummy credentials for testing
    const dummyCredentials = {
      doctor: {
        identifier: 'doctor@test.com',
        password: 'doctor123',
        userData: {
          id: 'DOC001',
          name: 'Dr. Sarah Johnson',
          email: 'doctor@test.com',
          role: 'doctor',
          specialization: 'Internal Medicine',
          license: 'MD12345'
        }
      },
      patient: {
        identifier: 'patient@test.com',
        password: 'patient123',
        userData: {
          id: 'PAT001',
          name: 'John Smith',
          email: 'patient@test.com',
          role: 'patient',
          age: 35,
          patientId: 'P12345'
        }
      },
      admin: {
        identifier: 'admin@test.com',
        password: 'admin123',
        userData: {
          id: 'ADM001',
          name: 'Admin User',
          email: 'admin@test.com',
          role: 'admin',
          permissions: ['all']
        }
      }
    }

    // Check credentials
    const roleCredentials = dummyCredentials[credentials.role]
    
    if (roleCredentials && 
        credentials.identifier === roleCredentials.identifier && 
        credentials.password === roleCredentials.password) {
      
      return {
        success: true,
        user: roleCredentials.userData,
        token: 'dummy-jwt-token-' + Date.now()
      }
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Please check your email and password.'
      }
    }
  }

  const mockApiRegister = async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful registration
    const newUser = {
      id: 'USER' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'patient'
    }

    return {
      success: true,
      user: newUser,
      token: 'dummy-jwt-token-' + Date.now()
    }
  }

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = { ...user, ...updatedData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      return { success: true }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
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
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}