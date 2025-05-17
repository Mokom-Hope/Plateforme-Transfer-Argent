const User = require('../models/userModels');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

/**
 * @desc    Inscrire un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async(req, res, next) => {
    try {
        const { email, password, firstName, lastName, phoneNumber } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Créer un nouvel utilisateur
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            // Pour l'instant, nous marquons les utilisateurs comme vérifiés
            // Dans une vraie application, nous ajouterions une étape de vérification par email
            isVerified: true
        });

        if (user) {
            res.status(201).json({
                status: 'success',
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    isVerified: user.isVerified,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Authentifier un utilisateur et obtenir un token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur par email
        const user = await User.findOne({ email });

        // Vérifier si l'utilisateur existe et si le mot de passe correspond
        if (user && (await user.matchPassword(password))) {
            res.json({
                status: 'success',
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    isVerified: user.isVerified,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async(req, res, next) => {
    try {
        // L'utilisateur est attaché à la requête par le middleware auth
        const user = await User.findById(req.user._id).select('-password');

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
 * @desc    Demander un lien de réinitialisation de mot de passe
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body;

        // Trouver l'utilisateur par email
        const user = await User.findOne({ email });

        if (!user) {
            // Pour des raisons de sécurité, nous ne révélons pas si l'email existe ou non
            return res.status(200).json({
                status: 'success',
                message: 'If your email is registered, you will receive a password reset link'
            });
        }

        // Dans une vraie application, nous générerions un token et enverrions un email
        // Pour l'instant, nous simulons juste la réponse

        res.status(200).json({
            status: 'success',
            message: 'If your email is registered, you will receive a password reset link'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Réinitialiser le mot de passe
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async(req, res, next) => {
    try {
        const { token, password } = req.body;

        // Dans une vraie application, nous vérifierions le token et mettrions à jour le mot de passe
        // Pour l'instant, nous simulons juste la réponse

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword
};