import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from './AuthContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const watchPassword = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await registerUser(data)
      console.log(result);
      
      if (result.success) {
        toast.success('Registration successful! Please login to continue.')
        navigate('/login')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Create Your Account</h2>
                  <p className="text-muted">Join Wellnex to access AI-powered healthcare tools</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter your full name"
                      {...register('name', { 
                        required: 'Full name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Create a password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
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

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Confirm your password"
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: value =>
                            value === watchPassword || 'Passwords do not match'
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      rows="2"
                      placeholder="Enter your address"
                      {...register('address', { 
                        required: 'Address is required' 
                      })}
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address.message}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter your phone number"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone.message}</div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Account Type</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="patient"
                          id="patient"
                          {...register('role', { required: 'Please select an account type' })}
                        />
                        <label className="form-check-label" htmlFor="patient">
                          Patient
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="admin"
                          id="admin"
                          {...register('role', { required: 'Please select an account type' })}
                        />
                        <label className="form-check-label" htmlFor="admin">
                          Admin
                        </label>
                      </div>
                    </div>
                    {errors.role && (
                      <div className="text-danger small mt-1">{errors.role.message}</div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        {...register('acceptTerms', { 
                          required: 'You must accept the terms and conditions' 
                        })}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary text-decoration-none">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary text-decoration-none">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <div className="text-danger small mt-1">{errors.acceptTerms.message}</div>
                    )}
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
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register