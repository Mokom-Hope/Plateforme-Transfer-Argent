const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    status: {
        type: String,
        enum: ['completed', 'failed'],
        default: 'completed',
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);