const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

/**
 * Middleware pour protéger les routes
 * Vérifie que l'utilisateur est authentifié via un token JWT
 */
const protect = async(req, res, next) => {
    try {
        let token;

        // Vérifier si le token est présent dans les headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Si pas de token
        if (!token) {
            res.status(401);
            throw new Error('Not authorized, no token provided');
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Trouver l'utilisateur et l'attacher à la requête
            // On exclut le mot de passe
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware pour vérifier si l'utilisateur est un admin
 * À utiliser après le middleware protect
 */
const admin = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403);
            throw new Error('Not authorized as admin');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { protect, admin };