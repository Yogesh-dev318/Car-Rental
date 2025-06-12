// routes/userRoutes.js
const express = require('express');
const {
  getUserProfile,
  updateprofile, // Renamed import
  getUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile); // This is still GET /api/users/profile

router.put("/update-profile", protect, updateprofile); // Changed route to /update-profile

router.route('/')
  .get(protect, authorizeRoles('admin'), getUsers);

router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;