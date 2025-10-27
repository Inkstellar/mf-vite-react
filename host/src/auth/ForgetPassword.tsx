import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Divider,
  CircularProgress
} from '@mui/material';
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
      <Container maxWidth="sm" sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Card sx={{
          width: '100%',
          maxWidth: 450,
          boxShadow: 3,
          borderRadius: 2
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{
                width: 64,
                height: 64,
                backgroundColor: '#28a745',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white'
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32 }}>
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16L6,12L7.41,10.59L11,14.17L16.59,8.59L18,10L11,16Z"/>
                </svg>
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Check Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                We've sent password reset instructions to
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {formData.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info" sx={{ textAlign: 'center' }}>
                If an account with this email exists, you'll receive password reset instructions shortly.
                Please check your email and follow the link to reset your password.
              </Alert>

              <Button
                onClick={handleResendEmail}
                variant="outlined"
                disabled={state.isLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {state.isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} color="inherit" />
                    Sending...
                  </Box>
                ) : (
                  'Resend Email'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                    state={{ from: location.state?.from }}
                  >
                    Back to Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Card sx={{
        width: '100%',
        maxWidth: 450,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your email to receive reset instructions
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Email Field */}
            <TextField
              fullWidth
              type="email"
              id="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              placeholder="Enter your email address"
              disabled={state.isLoading}
              variant="outlined"
            />

            {/* Error Message */}
            {state.error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {state.error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={state.isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              {state.isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Sending...
                </Box>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{' '}
                <Link
                  to="/login"
                  style={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                  state={{ from: location.state?.from }}
                >
                  Back to Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ForgetPassword;
