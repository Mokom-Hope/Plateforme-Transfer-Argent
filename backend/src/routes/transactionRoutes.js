const express = require('express');
const { sendMoney, getHistory } = require('../controllers/transactionController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/send', protect, sendMoney);
router.get('/history', protect, getHistory);

module.exports = router;