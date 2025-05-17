const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT pour l'authentification
 * @param {string} id - ID utilisateur
 * @param {number} expiresIn - Durée de validité en secondes (défaut: 30 jours)
 * @returns {string} Token JWT
 */
const generateToken = (id, expiresIn = '30d') => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn,
    });
};

module.exports = generateToken;