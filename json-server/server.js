const express = require('express');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

// Create Express app
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Create JSON server router
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Custom middleware for JWT authentication
const jwtMiddleware = (req, res, next) => {
  // Skip JWT validation for public routes (handle both /api/ and direct paths)
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/activate', '/api/login', '/api/register', '/api/forgot-password', '/api/reset-password', '/api/activate', '/upload'];
  const isPublicRoute = publicRoutes.some(route => req.path.includes(route));

  if (isPublicRoute || req.method === 'GET') {
    return next();
  }

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Password hashing middleware for user creation
const hashPasswordMiddleware = (req, res, next) => {
  if (req.path === '/users' && req.method === 'POST' && req.body.password) {
    const saltRounds = 10;
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    req.body.createdAt = new Date().toISOString();
    req.body.isActive = false; // Users need to activate their account
  }
  next();
};

// JWT token generation utility
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    claims: user.claims || [],
    isActive: user.isActive,
    profilePicture: user.profilePicture || ''
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Custom routes for authentication
const authRoutes = (req, res, next) => {
  // Handle both /login and /api/login paths
  const isApiPath = req.path.startsWith('/api/');
  const cleanPath = isApiPath ? req.path.substring(4) : req.path;

  // Login endpoint
  if (cleanPath === '/login' && req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const users = router.db.get('users').value();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password (in a real app, this would be hashed)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account not activated. Please check your email.' });
    }

    // Update last login time
    router.db.get('users')
      .find({ id: user.id })
      .assign({ lastLogin: new Date().toISOString() })
      .write();

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: new Date().toISOString(),
      claims: user.claims || [],
      profilePicture: user.profilePicture || ''
    };

    return res.json({
      user: userResponse,
      token: token,
      message: 'Login successful'
    });
  }

  // Register endpoint
  if (cleanPath === '/register' && req.method === 'POST') {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const users = router.db.get('users').value();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = {
      firstName,
      lastName,
      email,
      password, // This will be hashed by the hashPasswordMiddleware
      role: 'user',
      isActive: false,
      createdAt: new Date().toISOString(),
      claims: ['read'] // Default claims for new users
    };

    const createdUser = router.db.get('users').insert(newUser).write()[0];

    // Remove password from response
    const { password: _, ...userResponse } = createdUser;

    return res.status(201).json({
      user: userResponse,
      message: 'Registration successful. Please check your email for activation instructions.'
    });
  }

  // Forgot password endpoint
  if (cleanPath === '/forgot-password' && req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const users = router.db.get('users').value();
    const user = users.find(u => u.email === email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If an account with this email exists, you will receive password reset instructions.' });
    }

    // In a real app, you would send an email here
    console.log(`Password reset requested for: ${email}`);

    return res.json({
      message: 'If an account with this email exists, you will receive password reset instructions.'
    });
  }

  // Reset password endpoint
  if (cleanPath === '/reset-password' && req.method === 'POST') {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Update user password
      router.db.get('users')
        .find({ id: decoded.userId })
        .assign({
          password: bcrypt.hashSync(password, 10),
          lastLogin: new Date().toISOString()
        })
        .write();

      return res.json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
  }

  // Activate account endpoint
  if (cleanPath === '/activate' && req.method === 'POST') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Activation token is required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Activate user account
      const updatedUser = router.db.get('users')
        .find({ id: decoded.userId })
        .assign({ isActive: true })
        .write()[0];

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove password from response
      const { password: _, ...userResponse } = updatedUser;

      return res.json({
        user: userResponse,
        message: 'Account activated successfully'
      });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired activation token' });
    }
  }

  // Verify token endpoint
  if (cleanPath === '/verify-token' && req.method === 'GET') {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.json({ valid: true, user: decoded });
    } catch (error) {
      return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
    }
  }

  next();
};

// CORS configuration
app.use(cors({
  origin: ['http://localhost:4173', 'http://localhost:3000', 'http://127.0.0.1:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Apply middlewares
app.use(middlewares);
app.use(jsonServer.bodyParser);
app.use(hashPasswordMiddleware);
app.use(jwtMiddleware);
app.use(authRoutes);

// File upload endpoint (public endpoint - must be added after authRoutes but before router)
app.post('/upload', upload.single('profilePicture'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the relative path to the uploaded file
    const filePath = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      filePath: filePath,
      fileName: req.file.filename
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Custom route for updating user lastLogin (for internal use)
app.put('/users/:id/last-login', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = router.db.get('users').find({ id: userId }).value();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updatedUser = router.db.get('users')
    .find({ id: userId })
    .assign({ lastLogin: new Date().toISOString() })
    .write()[0];

  res.json(updatedUser);
});

// Use default router for all other routes
app.use(router);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Enhanced JSON Server with JWT Auth running on port ${PORT}`);
  console.log(`📝 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log(`⏰ Token expires in: ${JWT_EXPIRES_IN}`);
  console.log(`📁 File uploads available at: http://localhost:${PORT}/uploads`);
});

module.exports = app;
