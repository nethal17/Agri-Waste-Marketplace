import express from 'express';
import { createPayment, getAllPayments } from '../controllers/payment.controller.js';

const router = express.Router();

// Define the route for creating a payment
router.post('/payments', createPayment);

// Define the route for fetching all payments
router.get('/payments', getAllPayments);

export default router;