const express = require('express');
const {
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddlewares');

const router = express.Router();

// Routes pour l'utilisateur connecté
router.put('/profile', protect, updateUserProfile);

// Routes admin
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;