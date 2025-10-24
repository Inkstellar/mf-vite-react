import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LoginCredentials } from '../services/auth';

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
            <div className="form-options">
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

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-color) 0%, #2c5aa0 100%);
          padding: 20px;
        }

        .auth-container {
          width: 100%;
          max-width: 400px;
        }

        .auth-card {
          background: var(--light-bg);
          border-radius: var(--border-radius);
          padding: 40px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          color: var(--text-primary);
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 1rem;
          margin: 0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          color: var(--text-primary);
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background-color: #fff;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(49, 120, 198, 0.1);
        }

        .form-input.error {
          border-color: #dc3545;
        }

        .form-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .form-error {
          color: #dc3545;
          font-size: 0.8rem;
          margin-top: 4px;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .checkbox-label input[type="checkbox"] {
          margin-right: 8px;
        }

        .checkbox-custom {
          position: relative;
          width: 16px;
          height: 16px;
          border: 2px solid #e1e5e9;
          border-radius: 3px;
          margin-right: 8px;
          transition: all 0.2s ease;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .forgot-password-link {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        .form-error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: var(--border-radius);
          border: 1px solid #f5c6cb;
          font-size: 0.9rem;
          text-align: center;
        }

        .auth-button {
          padding: 14px 20px;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-button.primary {
          background-color: var(--primary-color);
          color: white;
        }

        .auth-button.primary:hover:not(:disabled) {
          background-color: #2c5aa0;
          transform: translateY(-1px);
        }

        .loading-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .loading-text::after {
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-divider {
          text-align: center;
          position: relative;
          margin: 20px 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #e1e5e9;
        }

        .auth-divider span {
          background-color: var(--light-bg);
          padding: 0 16px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          position: relative;
          z-index: 1;
        }

        .auth-footer {
          text-align: center;
        }

        .auth-footer p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        .auth-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 30px 20px;
          }

          .auth-header h1 {
            font-size: 1.8rem;
          }

          .form-options {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
