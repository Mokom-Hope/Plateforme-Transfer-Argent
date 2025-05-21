const User = require('../models/userModels');
const Transaction = require('../models/transaction');

exports.sendMoney = async(req, res, next) => {
    const { recipientIdentifier, amount, securityAnswer } = req.body;

    if (!recipientIdentifier || !amount || !securityAnswer) {
        return res.status(400).json({ message: 'Informations incomplètes' });
    }

    try {
        const sender = await User.findById(req.user.id);
        const recipient = await User.findOne({
            $or: [{ email: recipientIdentifier }, { phone: recipientIdentifier }],
        });

        if (!recipient) {
            return res.status(404).json({ message: 'Destinataire introuvable' });
        }

        // Vérification de la réponse à la question de sécurité
        const bcrypt = require('bcryptjs');
        const isCorrect = await bcrypt.compare(securityAnswer, sender.securityAnswer);
        if (!isCorrect) {
            return res.status(401).json({ message: 'Réponse à la question de sécurité incorrecte' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Fonds insuffisants' });
        }

        // Mise à jour des soldes
        sender.balance -= amount;
        recipient.balance += amount;
        await sender.save();
        await recipient.save();

        // Enregistrement de la transaction
        const transaction = await Transaction.create({
            sender: sender._id,
            recipient: recipient._id,
            amount,
        });

        res.status(201).json({ message: 'Transfert réussi', transaction });
    } catch (err) {
        next(err);
    }
};


exports.getHistory = async(req, res, next) => {
    try {
        const transactions = await Transaction.find({
                $or: [{ sender: req.user.id }, { recipient: req.user.id }],
            })
            .populate('sender', 'email')
            .populate('recipient', 'email')
            .sort({ createdAt: -1 });

        // Formater les transactions
        const formatted = transactions.map((tx) => ({
            _id: tx._id,
            type: tx.sender._id.toString() === req.user.id ? 'sent' : 'received',
            amount: tx.amount,
            from: tx.sender.email,
            to: tx.recipient.email,
            date: tx.createdAt.toLocaleString(), // format lisible
            status: tx.status,
        }));

        res.json(formatted);
    } catch (err) {
        next(err);
    }
};