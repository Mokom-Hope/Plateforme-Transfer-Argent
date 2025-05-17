const User = require('../models/userModels');

/**
 * @desc    Ajouter une méthode de paiement
 * @route   POST /api/payment-methods
 * @access  Private
 */
const addPaymentMethod = async(req, res, next) => {
    try {
        const { type, name, details } = req.body;

        // Valider les données
        if (!type || !name) {
            res.status(400);
            throw new Error('Please provide type and name for the payment method');
        }

        // Récupérer l'utilisateur
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Créer une nouvelle méthode de paiement
        const newPaymentMethod = {
            type,
            name,
            details: details || {},
            isDefault: user.paymentMethods.length === 0 // Premier = par défaut
        };

        // Ajouter à l'utilisateur
        user.paymentMethods.push(newPaymentMethod);
        await user.save();

        res.status(201).json({
            status: 'success',
            data: newPaymentMethod
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Obtenir toutes les méthodes de paiement
 * @route   GET /api/payment-methods
 * @access  Private
 */
const getPaymentMethods = async(req, res, next) => {
    try {
        // Récupérer l'utilisateur avec ses méthodes de paiement
        const user = await User.findById(req.user._id).select('paymentMethods');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.json({
            status: 'success',
            data: user.paymentMethods
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Définir une méthode de paiement par défaut
 * @route   PUT /api/payment-methods/:id/set-default
 * @access  Private
 */
const setDefaultPaymentMethod = async(req, res, next) => {
    try {
        const methodId = req.params.id;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Trouver l'index de la méthode de paiement
        const methodIndex = user.paymentMethods.findIndex(
            (method) => method._id.toString() === methodId
        );

        if (methodIndex === -1) {
            res.status(404);
            throw new Error('Payment method not found');
        }

        // Mettre toutes les méthodes à non-défaut
        user.paymentMethods.forEach((method) => {
            method.isDefault = false;
        });

        // Définir la méthode sélectionnée comme défaut
        user.paymentMethods[methodIndex].isDefault = true;

        await user.save();

        res.json({
            status: 'success',
            data: user.paymentMethods[methodIndex]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Supprimer une méthode de paiement
 * @route   DELETE /api/payment-methods/:id
 * @access  Private
 */
const deletePaymentMethod = async(req, res, next) => {
    try {
        const methodId = req.params.id;
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Trouver l'index de la méthode de paiement
        const methodIndex = user.paymentMethods.findIndex(
            (method) => method._id.toString() === methodId
        );

        if (methodIndex === -1) {
            res.status(404);
            throw new Error('Payment method not found');
        }

        // Vérifier si c'est la méthode par défaut
        const isDefault = user.paymentMethods[methodIndex].isDefault;

        // Supprimer la méthode
        user.paymentMethods.splice(methodIndex, 1);

        // Si c'était la méthode par défaut et qu'il reste des méthodes,
        // définir la première comme défaut
        if (isDefault && user.paymentMethods.length > 0) {
            user.paymentMethods[0].isDefault = true;
        }

        await user.save();

        res.json({
            status: 'success',
            message: 'Payment method removed'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mettre à jour une méthode de paiement
 * @route   PUT /api/payment-methods/:id
 * @access  Private
 */
const updatePaymentMethod = async(req, res, next) => {
    try {
        const methodId = req.params.id;
        const { name, details } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Trouver l'index de la méthode de paiement
        const methodIndex = user.paymentMethods.findIndex(
            (method) => method._id.toString() === methodId
        );

        if (methodIndex === -1) {
            res.status(404);
            throw new Error('Payment method not found');
        }

        // Mettre à jour les champs
        if (name) user.paymentMethods[methodIndex].name = name;
        if (details) user.paymentMethods[methodIndex].details = details;

        await user.save();

        res.json({
            status: 'success',
            data: user.paymentMethods[methodIndex]
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addPaymentMethod,
    getPaymentMethods,
    setDefaultPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod
};