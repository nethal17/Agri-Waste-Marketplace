import express from 'express';
import { getAllPayments } from '../controllers/payment.controller.js';

const router = express.Router();

// Define the route for fetching payment history
router.get('/payments', getAllPayments);

export default router;