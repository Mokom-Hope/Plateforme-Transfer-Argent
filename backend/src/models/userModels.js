const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    paymentMethods: [{
        type: {
            type: String,
            enum: ['card', 'bank', 'mobile_wallet'],
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        // Les détails sensibles seraient stockés de manière sécurisée ou via un service tiers
        // Ces champs sont à titre d'exemple uniquement
        details: {
            lastFour: String,
            expiryDate: String,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    }, ],
}, {
    timestamps: true,
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware pour hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;