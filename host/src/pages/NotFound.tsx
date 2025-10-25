import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
    //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
         {/* Fun Animation/Icon */}
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
          🚀
        </Box>
        {/* 404 Number */}
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontSize: '8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            color: '#333',
            fontWeight: 600,
            mb: 2
          }}
        >
          Page Not Found
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
          Oops! The page you're looking for seems to have wandered off into the digital void.
          Don't worry, it happens to the best of us!
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

        {/* Fun Suggestions */}
        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You might want to try:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 1 }}>
            {[
              { path: '/', label: '🏠 Home' },
              { path: '/about', label: 'ℹ️ About' },
              { path: '/admin', label: '⚙️ Admin' },
              { path: '/services', label: '🔧 Services' },
              { path: '/portfolio', label: '💼 Portfolio' }
            ].map((item) => (
              <Button
                key={item.path}
                variant="text"
                size="small"
                onClick={() => navigate(item.path)}
                sx={{
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box> */}
      </Paper>
    </Container>
  );
};

export default NotFound;
