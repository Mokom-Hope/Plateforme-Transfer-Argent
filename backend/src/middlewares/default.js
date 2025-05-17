const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Middleware pour configurer les options par défaut
const configureDefaultMiddleware = (app) => {
    // Amélioration de la sécurité
    app.use(helmet());

    // Configuration CORS
    app.use(cors({
        origin: process.env.NODE_ENV === 'production' ?
            process.env.FRONTEND_URL :
            'http://localhost:3000',
        credentials: true
    }));

    // Parser pour le JSON
    app.use(express.json());

    // Parser pour les formulaires
    app.use(express.urlencoded({ extended: true }));

    // Logging des requêtes
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
};

module.exports = configureDefaultMiddleware;