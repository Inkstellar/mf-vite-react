import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  message?: string;
  title?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  message = "Something went wrong while loading this component.",
  title = "Loading Error"
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
    }}>
      <Paper
        elevation={24}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          maxWidth: 600,
          width: '100%'
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            fontSize: '4rem',
            mb: 3,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateY(0)',
              },
              '40%': {
                transform: 'translateY(-10px)',
              },
              '60%': {
                transform: 'translateY(-5px)',
              },
            },
          }}
        >
          ⚠️
        </Box>

        {/* Error Title */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: '2.5rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 400,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          {message}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2, #667eea)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              }
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: '#764ba2',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              }
            }}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ErrorFallback;
