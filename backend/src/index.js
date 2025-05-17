const express = require('express');
require('dotenv').config();
const configureDefaultMiddleware = require('./middlewares/default');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/error');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const paymentMethodRoutes = require('./routes/payment-method.routes');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration des middlewares
configureDefaultMiddleware(app);

// Routes de base
app.get('/', (req, res) => {
    res.send('PayLink API is running!');
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);

// Route de status
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running properly',
        environment: process.env.NODE_ENV,
        timestamp: new Date()
    });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

// Connexion à MongoDB et démarrage du serveur
const startServer = async() => {
    try {
        // Connexion à MongoDB
        await connectDB();

        // Démarrage du serveur
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Démarrer le serveur
startServer();

// Pour les tests
module.exports = app;