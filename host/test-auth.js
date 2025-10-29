// Test script to verify JWT token generation and decoding
import jwt from 'jsonwebtoken';

// Simulate the JWT token generation like the server does
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

const user = {
  id: 6,
  firstName: "Kousi",
  lastName: "Moni",
  email: "kousi@testmail.com",
  role: "designer",
  isActive: true,
  claims: ["admin", "admin.access", "admin.write"],
  profilePicture: "/uploads/profilePicture-1761570126116-767364093.png"
};

const token = jwt.sign({
  userId: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  claims: user.claims || [],
  isActive: user.isActive,
  profilePicture: user.profilePicture || ''
}, JWT_SECRET, { expiresIn: '24h' });

console.log('Generated JWT token:', token);

// Decode the token to verify it contains the profile picture
const decoded = jwt.verify(token, JWT_SECRET);
console.log('Decoded token payload:', JSON.stringify(decoded, null, 2));

// Test the getUserFromToken logic
function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return {
      id: payload.userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
      createdAt: '',
      lastLogin: '',
      claims: payload.claims || [],
      profilePicture: payload.profilePicture || ''
    };
  } catch {
    return null;
  }
}

const userFromToken = getUserFromToken(token);
console.log('User from token:', JSON.stringify(userFromToken, null, 2));
