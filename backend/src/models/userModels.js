const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 1000, // solde initial fictif pour test
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // permet de ne pas le rendre obligatoire
    },
    password: {
        type: String,
        required: true,
    },
    securityQuestion: {
        type: String,
        default: '',
    },
    securityAnswer: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);