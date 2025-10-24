import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ForgotPasswordData } from '../services/auth';

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { forgotPassword, state, clearError } = useAuth();

  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<ForgotPasswordData>>({});
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Get redirect path from location state or default to login
  const from = (location.state as any)?.from?.pathname || '/login';

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (state.error) {
      clearError();
    }
  }, [formData.email]);

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [state.isAuthenticated, navigate, from]);

  const validateForm = (): boolean => {
    const errors: Partial<ForgotPasswordData> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof ForgotPasswordData]) {
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
      await forgotPassword(formData);
      setIsEmailSent(true);
    } catch (error) {
      // Error is handled by the auth context
      console.error('Forgot password failed:', error);
    }
  };

  const handleResendEmail = async () => {
    try {
      await forgotPassword(formData);
    } catch (error) {
      console.error('Resend email failed:', error);
    }
  };

  if (isEmailSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
                </svg>
              </div>
              <h1>Check Your Email</h1>
              <p>We've sent password reset instructions to</p>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                {formData.email}
              </p>
            </div>

            <div className="auth-form">
              <div className="success-message">
                <p>
                  If an account with this email exists, you'll receive password reset instructions shortly.
                  Please check your email and follow the link to reset your password.
                </p>
              </div>

              <button
                onClick={handleResendEmail}
                className="auth-button secondary"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <span className="loading-text">Sending...</span>
                ) : (
                  'Resend Email'
                )}
              </button>

              <div className="auth-footer">
                <p>
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="auth-link"
                    state={{ from: location.state?.from }}
                  >
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .success-icon {
            width: 64px;
            height: 64px;
            background-color: #28a745;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
          }

          .success-icon svg {
            width: 32px;
            height: 32px;
          }

          .success-message {
            text-align: center;
            margin-bottom: 30px;
          }

          .success-message p {
            color: var(--text-secondary);
            line-height: 1.6;
            margin: 0;
          }

          .auth-button.secondary {
            background-color: transparent;
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
          }

          .auth-button.secondary:hover:not(:disabled) {
            background-color: var(--primary-color);
            color: white;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive reset instructions</p>
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
                placeholder="Enter your email address"
                disabled={state.isLoading}
              />
              {formErrors.email && (
                <span className="form-error">{formErrors.email}</span>
              )}
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
                <span className="loading-text">Sending...</span>
              ) : (
                'Send Reset Instructions'
              )}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>or</span>
            </div>

            {/* Login Link */}
            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="auth-link"
                  state={{ from: location.state?.from }}
                >
                  Back to Sign In
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
        }
      `}</style>
    </div>
  );
};

export default ForgetPassword;
