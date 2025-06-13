const express = require('express');
const {
  getUserProfile,
  updateprofile, 
  getUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile); 

router.put("/update-profile", protect, updateprofile); 

router.route('/')
  .get(protect, authorizeRoles('admin'), getUsers);

router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;