// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  // Set token as an HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 7*24*60*60*1000, 
    path: '/', // The path for which the cookie is valid
  });
};

module.exports = generateToken;