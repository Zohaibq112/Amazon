const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

// Process Payment (Auto-Approve)
router.route('/payment/process').post(processPayment);

// Get Payment Status
router.route('/payment/status/:id').get(isAuthenticatedUser, getPaymentStatus);

module.exports = router;
