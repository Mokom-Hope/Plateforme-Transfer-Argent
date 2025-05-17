const mongoose = require('mongoose');
const User = require('../models/userModels');
const Transaction = require('../models/transaction');
require('dotenv').config();

// Fonction pour ajouter des utilisateurs de test
const seedUsers = async() => {
    try {
        // Supprimer les utilisateurs existants
        await User.deleteMany({});

        // Créer un utilisateur de test
        const user1 = await User.create({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+33123456789',
            balance: 1000,
            isVerified: true,
        });

        const user2 = await User.create({
            email: 'jane@example.com',
            password: 'password123',
            firstName: 'Jane',
            lastName: 'Smith',
            phoneNumber: '+33987654321',
            balance: 500,
            isVerified: true,
        });

        console.log('Utilisateurs de test créés!');
        return { user1, user2 };
    } catch (error) {
        console.error('Erreur lors de la création des utilisateurs:', error);
        throw error;
    }
};

// Fonction pour ajouter des transactions de test
const seedTransactions = async(users) => {
    try {
        // Supprimer les transactions existantes
        await Transaction.deleteMany({});

        // Créer une transaction de test
        await Transaction.create({
            sender: users.user1._id,
            recipient: {
                email: 'recipient@example.com',
                phoneNumber: '+33555555555',
            },
            amount: 150,
            currency: 'EUR',
            status: 'pending',
            securityQuestion: {
                question: 'Quelle est ma couleur préférée?',
                answer: 'bleu',
            },
            transferMethod: {
                senderMethod: 'card',
            },
            reference: 'TX12345678',
            accessLink: 'token_123456',
        });

        console.log('Transactions de test créées!');
    } catch (error) {
        console.error('Erreur lors de la création des transactions:', error);
        throw error;
    }
};

// Fonction principale pour lancer le seed
const seedDatabase = async() => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB pour le seed');

        // Lancer le seed des utilisateurs puis des transactions
        const users = await seedUsers();
        await seedTransactions(users);

        console.log('Base de données initialisée avec succès!');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
};

// Exécuter la fonction de seed
seedDatabase();