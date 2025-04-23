import express from 'express';
import { createDriverPaymentSession } from '../controllers/stripePayment.controller.js';

const router = express.Router();

// Route for creating a driver payment session
router.post('/driver-payment', createDriverPaymentSession);

export default router; 