import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from './AuthContext'
import { FaEye, FaEyeSlash, FaUser, FaUserMd, FaUserShield } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm()

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

  const selectedRole = watch('role')

  // Function to fill dummy credentials
  const fillDummyCredentials = (role) => {
    const credentials = dummyCredentials[role]
    if (credentials) {
      setValue('identifier', credentials.identifier)
      setValue('password', credentials.password)
      setValue('role', role)
      toast.success(`Filled ${role} credentials`)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if credentials match dummy data
      const roleCredentials = dummyCredentials[data.role]
      
      if (roleCredentials && 
          data.identifier === roleCredentials.identifier && 
          data.password === roleCredentials.password) {
        
        // Simulate successful login with your AuthContext
        const loginResult = await login({
          user: roleCredentials.userData,
          token: 'dummy-jwt-token-' + Date.now()
        })
        
        toast.success(`Welcome ${roleCredentials.userData.name}!`)
        
        // Navigate to dashboard (your DashboardRoute will handle role-based rendering)
        navigate('/dashboard')
      } else {
        toast.error('Invalid credentials. Please use the dummy credentials provided.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Welcome back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {/* Dummy Credentials Info */}
                <div className="alert alert-info mb-4">
                  <h6 className="fw-bold mb-2">
                    <FaUser className="me-2" />
                    Test Credentials
                  </h6>
                  <small className="d-block mb-2">Click to auto-fill credentials:</small>
                  
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => fillDummyCredentials('doctor')}
                    >
                      <FaUserMd className="me-1" />
                      Doctor
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={() => fillDummyCredentials('patient')}
                    >
                      <FaUser className="me-1" />
                      Patient
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => fillDummyCredentials('admin')}
                    >
                      <FaUserShield className="me-1" />
                      Admin
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Role</label>
                    <select 
                      className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                      {...register('role', { required: 'Please select a role' })}
                    >
                      <option value="">Select your role</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && (
                      <div className="invalid-feedback">{errors.role.message}</div>
                    )}
                  </div>

                  {/* Email/Patient ID */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Email or Patient ID</label>
                    <input
                      type="text"
                      className={`form-control ${errors.identifier ? 'is-invalid' : ''}`}
                      placeholder="Enter your email or patient ID"
                      {...register('identifier', { 
                        required: 'Email or Patient ID is required' 
                      })}
                    />
                    {errors.identifier && (
                      <div className="invalid-feedback">{errors.identifier.message}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password.message}</div>
                      )}
                    </div>
                  </div>

                  {/* Show credentials for selected role */}
                  {selectedRole && dummyCredentials[selectedRole] && (
                    <div className="alert alert-light mb-4">
                      <small className="text-muted">
                        <strong>Test credentials for {selectedRole}:</strong><br />
                        Email: {dummyCredentials[selectedRole].identifier}<br />
                        Password: {dummyCredentials[selectedRole].password}
                      </small>
                    </div>
                  )}

                  {/* Forgot Password */}
                  <div className="mb-4">
                    <Link to="/forgot-password" className="text-primary text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading-spinner me-2"></span>
                    ) : null}
                    {loading ? 'Signing in...' : 'Login'}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Sign up
                    </Link>
                  </p>
                </div>

                {/* Credentials Table */}
                <div className="mt-4">
                  <details className="text-muted">
                    <summary className="cursor-pointer small fw-semibold">View All Test Credentials</summary>
                    <div className="mt-2">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Password</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="badge bg-primary">Doctor</span></td>
                            <td><small>doctor@test.com</small></td>
                            <td><small>doctor123</small></td>
                          </tr>
                          <tr>
                            <td><span className="badge bg-success">Patient</span></td>
                            <td><small>patient@test.com</small></td>
                            <td><small>patient123</small></td>
                          </tr>
                          <tr>
                            <td><span className="badge bg-warning">Admin</span></td>
                            <td><small>admin@test.com</small></td>
                            <td><small>admin123</small></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login