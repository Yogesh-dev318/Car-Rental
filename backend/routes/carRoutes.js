// routes/carRoutes.js
const express = require('express');
const {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('admin'), addCar)
  .get(getCars);

router.route('/:id')
  .get(getCarById)
  .put(protect, authorizeRoles('admin'), updateCar)
  .delete(protect, authorizeRoles('admin'), deleteCar);

module.exports = router;