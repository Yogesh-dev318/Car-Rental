const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const prisma = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    try {
      token = req.cookies.token;

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, firstName: true, lastName: true, email: true, role: true }
      });

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); 
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Not authorized to access this route');
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };