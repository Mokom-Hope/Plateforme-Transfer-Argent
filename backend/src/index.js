const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/error');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Exemple de route pour test
app.get('/', (req, res) => {
    res.send('API en ligne 🚀');
});

// Middleware d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
const balanceRoutes = require('./routes/balanceRoutes');
app.use('/api/balance', balanceRoutes);
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));