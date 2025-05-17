const nodemailer = require('nodemailer');

/**
 * Configuration du transporteur d'emails
 * En développement, nous utilisons un transporteur "ethereal" qui capture les emails
 * En production, il faudrait configurer un vrai transporteur SMTP
 */
const createTransporter = async() => {
    if (process.env.NODE_ENV === 'production') {
        // Configuration de production (ex: SendGrid, Mailgun, etc.)
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    } else {
        // Pour le développement, utiliser Ethereal (emails de test)
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }
};

/**
 * Envoyer un email
 * @param {Object} options - Options d'email
 * @returns {Promise} - Résultat de l'envoi
 */
const sendEmail = async(options) => {
        try {
            const transporter = await createTransporter();

            const mailOptions = {
                    from: process.env.EMAIL_FROM || '"Pay