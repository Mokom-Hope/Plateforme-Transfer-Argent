const User = require('../models/userModels');

/**
 * @desc    Mettre à jour le profil utilisateur
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Mettre à jour les champs envoyés
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            // Si l'email est fourni et différent
            if (req.body.email && req.body.email !== user.email) {
                // Vérifier si l'email est déjà utilisé
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    res.status(400);
                    throw new Error('Email already in use');
                }
                user.email = req.body.email;
            }

            // Si le mot de passe est fourni
            if (req.body.password) {
                user.password = req.body.password;
            }

            // Sauvegarder les modifications
            const updatedUser = await user.save();

            res.json({
                status: 'success',
                data: {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                    isVerified: updatedUser.isVerified
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Obtenir tous les utilisateurs (admin uniquement)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async(req, res, next) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Compter le nombre total d'utilisateurs
        const total = await User.countDocuments({});

        // Récupérer les utilisateurs avec pagination
        const users = await User.find({})
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            status: 'success',
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Supprimer un utilisateur (admin uniquement)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Empêcher la suppression d'un administrateur
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot delete admin user');
            }

            await user.deleteOne();
            res.json({
                status: 'success',
                message: 'User removed'
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Obtenir un utilisateur par ID (admin uniquement)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json({
                status: 'success',
                data: user
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mettre à jour un utilisateur (admin uniquement)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Mettre à jour les champs envoyés
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            // Admin peut modifier le rôle et le statut de vérification
            if (req.body.role) user.role = req.body.role;
            if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;

            // Mettre à jour le solde (pour des tests uniquement)
            if (req.body.balance !== undefined) user.balance = req.body.balance;

            // Sauvegarder les modifications
            const updatedUser = await user.save();

            res.json({
                status: 'success',
                data: {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                    isVerified: updatedUser.isVerified,
                    balance: updatedUser.balance
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
};