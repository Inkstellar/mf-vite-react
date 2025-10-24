import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Activation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activateAccount, state } = useAuth();

  const [activationStatus, setActivationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const handleActivation = async () => {
      if (!token) {
        setActivationStatus('error');
        setMessage('Invalid activation link. No token provided.');
        return;
      }

      try {
        await activateAccount(token);
        setActivationStatus('success');
        setMessage('Your account has been successfully activated! You can now sign in.');
      } catch (error) {
        setActivationStatus('error');
        setMessage(error instanceof Error ? error.message : 'Account activation failed. Please try again.');
      }
    };

    handleActivation();
  }, [token, activateAccount]);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleResendActivation = () => {
    // This would typically require the user's email
    // For now, we'll just redirect to login
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className={`status-icon ${activationStatus}`}>
              {activationStatus === 'loading' && (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
                </svg>
              )}
              {activationStatus === 'success' && (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16L6,12L7.41,10.59L11,14.17L16.59,8.59L18,10L11,16Z"/>
                </svg>
              )}
              {activationStatus === 'error' && (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
                </svg>
              )}
            </div>
            <h1>
              {activationStatus === 'loading' && 'Activating Account...'}
              {activationStatus === 'success' && 'Account Activated!'}
              {activationStatus === 'error' && 'Activation Failed'}
            </h1>
            <p>{message}</p>
          </div>

          <div className="auth-form">
            {activationStatus === 'loading' && (
              <div className="loading-message">
                <p>Please wait while we activate your account...</p>
                <div className="loading-spinner"></div>
              </div>
            )}

            {activationStatus === 'success' && (
              <>
                <div className="success-message">
                  <p>Welcome! Your account is now active and ready to use.</p>
                </div>
                <button
                  onClick={handleSignIn}
                  className="auth-button primary"
                >
                  Continue to Sign In
                </button>
              </>
            )}

            {activationStatus === 'error' && (
              <>
                <div className="error-message">
                  <p>
                    The activation link may be expired or invalid. Please try registering again
                    or contact support if you continue to have issues.
                  </p>
                </div>
                <button
                  onClick={handleResendActivation}
                  className="auth-button secondary"
                  disabled={state.isLoading}
                >
                  {state.isLoading ? (
                    <span className="loading-text">Sending...</span>
                  ) : (
                    'Resend Activation Email'
                  )}
                </button>
                <div className="auth-footer">
                  <p>
                    <Link to="/register" className="auth-link">
                      Back to Registration
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
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
          max-width: 450px;
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

        .status-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .status-icon.loading {
          background-color: #ffc107;
          color: white;
        }

        .status-icon.success {
          background-color: #28a745;
          color: white;
        }

        .status-icon.error {
          background-color: #dc3545;
          color: white;
        }

        .status-icon svg {
          width: 32px;
          height: 32px;
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
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .loading-message {
          text-align: center;
          margin-bottom: 20px;
        }

        .loading-message p {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e1e5e9;
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .success-message,
        .error-message {
          text-align: center;
          margin-bottom: 20px;
        }

        .success-message p,
        .error-message p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .error-message p {
          color: #721c24;
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

        .auth-button.secondary {
          background-color: transparent;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }

        .auth-button.secondary:hover:not(:disabled) {
          background-color: var(--primary-color);
          color: white;
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

        .auth-footer {
          text-align: center;
          margin-top: 20px;
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

export default Activation;
