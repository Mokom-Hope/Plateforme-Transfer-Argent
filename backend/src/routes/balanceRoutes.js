const express = require('express');
const { deposit, withdraw } = require('../controllers/balanceController');
const protect = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);

module.exports = router;