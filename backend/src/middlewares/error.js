/**
 * Middleware de gestion d'erreurs centralisé
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Log pour le débogage en développement
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    res.status(statusCode).json({
        status: 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        errors: err.errors || null
    });
};

module.exports = errorHandler;