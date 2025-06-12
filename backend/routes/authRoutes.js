// routes/authRoutes.js
const express = require('express');
const { signup, Login, Logout, CheckAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

router.post("/signup", signup); // Changed from /register to /signup
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/check", protect, CheckAuth); // New route to check authentication status

module.exports = router;