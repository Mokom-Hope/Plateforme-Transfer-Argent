const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Routes protégées
router.get('/profile', protect, getUserProfile);

module.exports = router;