import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress
} from '@mui/material';
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

  const getStatusIcon = () => {
    switch (activationStatus) {
      case 'loading':
        return (
          <Box sx={{
            width: 64,
            height: 64,
            backgroundColor: '#ffc107',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white'
          }}>
            <CircularProgress size={32} color="inherit" />
          </Box>
        );
      case 'success':
        return (
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
        );
      case 'error':
        return (
          <Box sx={{
            width: 64,
            height: 64,
            backgroundColor: '#dc3545',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white'
          }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32 }}>
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
            </svg>
          </Box>
        );
    }
  };

  const getStatusTitle = () => {
    switch (activationStatus) {
      case 'loading':
        return 'Activating Account...';
      case 'success':
        return 'Account Activated!';
      case 'error':
        return 'Activation Failed';
    }
  };

  return (
    <Container maxWidth="sm" sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      background: 'linear-gradient(135deg, var(--primary-color) 0%, #2c5aa0 100%)'
    }}>
      <Card sx={{
        width: '100%',
        maxWidth: 450,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {getStatusIcon()}
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {getStatusTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {message}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activationStatus === 'loading' && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please wait while we activate your account...
                </Typography>
                <CircularProgress size={40} sx={{ mt: 2 }} />
              </Box>
            )}

            {activationStatus === 'success' && (
              <>
                <Alert severity="success" sx={{ textAlign: 'center' }}>
                  Welcome! Your account is now active and ready to use.
                </Alert>
                <Button
                  onClick={handleSignIn}
                  variant="contained"
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Continue to Sign In
                </Button>
              </>
            )}

            {activationStatus === 'error' && (
              <>
                <Alert severity="error" sx={{ textAlign: 'center' }}>
                  The activation link may be expired or invalid. Please try registering again
                  or contact support if you continue to have issues.
                </Alert>
                <Button
                  onClick={handleResendActivation}
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
                    'Resend Activation Email'
                  )}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    to="/register"
                    style={{
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    Back to Registration
                  </Link>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Activation;
