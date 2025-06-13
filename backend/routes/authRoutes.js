const express = require('express');
const { signup, Login, Logout, CheckAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post("/signup", signup); 
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/check", protect, CheckAuth); 

module.exports = router;