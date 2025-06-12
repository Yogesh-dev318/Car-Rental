// controllers/userController.js
const asyncHandler = require('express-async-handler');
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get user profile (still handled by GET /api/users/profile)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware
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

  // Check if new email is already taken by another user (if email is being changed)
  if (email && email !== user.email) {
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already taken by another account.');
    }
  }

  let hashedPassword = user.password;
  if (password) {
    // Only hash password if a new password is provided
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      firstName: firstName !== undefined ? firstName : user.firstName,
      lastName: lastName !== undefined ? lastName : user.lastName,
      email: email !== undefined ? email : user.email,
      password: hashedPassword, // Use new hashed password or old one
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

  // Prevent admin from deleting themselves or other admins accidentally
  if (user.role === 'admin' && user.id === req.user.id) {
    res.status(400);
    throw new Error('Admin cannot delete their own account directly through this endpoint.');
  }
  if (user.role === 'admin' && user.id !== req.user.id) {
     res.status(403);
     throw new Error('Cannot delete another admin account.');
  }


  // Before deleting a user, consider deleting their associated bookings
  // or reassigning them, depending on your business rules.
  // For simplicity, here we'll just delete the user, which will fail
  // due to foreign key constraints if bookings exist (if not set to CASCADE).
  // If you set `onDelete: Cascade` in schema.prisma for Booking.userId,
  // then bookings will automatically be deleted.
  // For example: `userId     String @relation(fields: [userId], references: [id], onDelete: Cascade)`

  // Check if user has active bookings (if you want to prevent deletion)
  const activeBookings = await prisma.booking.count({
    where: {
      userId: req.params.id,
      status: { in: ['pending', 'confirmed'] } // Consider 'completed' if you want to keep history
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
  updateprofile, // Renamed
  getUsers,
  deleteUser,
};