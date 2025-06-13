const express = require('express');
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  generateInvoice,
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('customer'), createBooking)
  .get(protect, authorizeRoles('admin'), getAllBookings);

router.get('/my', protect, authorizeRoles('customer'), getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/status', protect, authorizeRoles('admin'), updateBookingStatus);
router.get('/:id/invoice', protect, generateInvoice);

module.exports = router;