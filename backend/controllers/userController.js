const asyncHandler = require('express-async-handler');
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get user profile (still handled by GET /api/users/profile)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, updatedAt: true },
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User profile not found.');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/update-profile
// @access  Private
const updateprofile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  if (email && email !== user.email) {
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already taken by another account.');
    }
  }

  let hashedPassword = user.password;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      firstName: firstName !== undefined ? firstName : user.firstName,
      lastName: lastName !== undefined ? lastName : user.lastName,
      email: email !== undefined ? email : user.email,
      password: hashedPassword, 
    },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, updatedAt: true },
  });

  res.status(200).json(updatedUser);
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, updatedAt: true },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.status(200).json(users);
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  if (user.role === 'admin' && user.id === req.user.id) {
    res.status(400);
    throw new Error('Admin cannot delete their own account directly through this endpoint.');
  }
  if (user.role === 'admin' && user.id !== req.user.id) {
     res.status(403);
     throw new Error('Cannot delete another admin account.');
  }

  const activeBookings = await prisma.booking.count({
    where: {
      userId: req.params.id,
      status: { in: ['pending', 'confirmed'] }
    }
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error('User has active bookings and cannot be deleted.');
  }

  await prisma.user.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({ message: 'User removed successfully.' });
});

module.exports = {
  getUserProfile,
  updateprofile, 
  getUsers,
  deleteUser,
};