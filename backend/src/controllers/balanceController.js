const User = require('../models/userModels');

exports.deposit = async(req, res, next) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Montant invalide' });
    }

    try {
        const user = await User.findById(req.user.id);
        user.balance += amount;
        await user.save();

        res.status(200).json({ message: 'Dépôt effectué', balance: user.balance });
    } catch (err) {
        next(err);
    }
};

exports.withdraw = async(req, res, next) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Montant invalide' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Fonds insuffisants' });
        }

        user.balance -= amount;
        await user.save();

        res.status(200).json({ message: 'Retrait effectué', balance: user.balance });
    } catch (err) {
        next(err);
    }
};