import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LoginCredentials } from '../services/auth';
import './auth-styles.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, state, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState<Partial<LoginCredentials>>({});

  // Get redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (state.error) {
      clearError();
    }
  }, [formData.email, formData.password]);

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [state.isAuthenticated, navigate, from]);

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof LoginCredentials]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Redirect will happen automatically via useEffect
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                disabled={state.isLoading}
              />
              {formErrors.email && (
                <span className="form-error">{formErrors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                disabled={state.isLoading}
              />
              {formErrors.password && (
                <span className="form-error">{formErrors.password}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options login-page">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={state.isLoading}
                />
                <span className="checkbox-custom"></span>
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="forgot-password-link"
                state={{ from: location.state?.from }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {state.error && (
              <div className="form-error-message">
                {state.error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button primary"
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <span className="loading-text">Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Register Link */}
            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="auth-link"
                  state={{ from: location.state?.from }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
