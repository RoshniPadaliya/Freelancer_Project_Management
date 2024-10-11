// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPayment,
    getAllPayments,
    getPayment,
    updatePayment,
    deletePayment,
    simulatePayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/')
    .post(protect, createPayment)
    .get(protect, getAllPayments);

router.route('/:id')
    .get(protect, getPayment)
    .put(protect, updatePayment)
    .delete(protect, deletePayment);

router.route('/:id/pay')
    .post(protect, simulatePayment);

module.exports = router;
