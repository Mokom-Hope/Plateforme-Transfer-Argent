const express = require('express');
const {
    addPaymentMethod,
    getPaymentMethods,
    setDefaultPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod
} = require('../controllers/paymentMethod.controller');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes protégées
router.route('/')
    .get(protect, getPaymentMethods)
    .post(protect, addPaymentMethod);

router.route('/:id')
    .put(protect, updatePaymentMethod)
    .delete(protect, deletePaymentMethod);

router.put('/:id/set-default', protect, setDefaultPaymentMethod);

module.exports = router;