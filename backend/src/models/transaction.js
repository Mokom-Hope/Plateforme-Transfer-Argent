const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    currency: {
        type: String,
        required: true,
        default: 'EUR',
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'expired'],
        default: 'pending',
    },
    securityQuestion: {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    transferMethod: {
        senderMethod: {
            type: String,
            enum: ['card', 'bank', 'mobile_wallet', 'balance'],
            required: true,
        },
        recipientMethod: {
            type: String,
            enum: ['card', 'bank', 'mobile_wallet', 'balance'],
        },
    },
    reference: {
        type: String,
        unique: true,
    },
    accessLink: {
        type: String,
        unique: true,
    },
    accessLinkExpiry: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

// Générer un numéro de référence unique avant de sauvegarder
transactionSchema.pre('save', async function(next) {
    if (!this.reference) {
        this.reference = 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;