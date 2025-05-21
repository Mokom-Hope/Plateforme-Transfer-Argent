const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Génère un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async(req, res, next) => {
    try {
        const { email, phone, password, securityQuestion, securityAnswer } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

        const user = await User.create({
            email,
            phone,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedAnswer,
        });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Identifiants invalides' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

exports.getCurrentUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password -securityAnswer');
        res.json(user);
    } catch (err) {
        next(err);
    }
};