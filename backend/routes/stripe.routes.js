import express from 'express';
import { createCheckoutSession } from '../controllers/stripe.controller.js';

const router = express.Router();

// Define the route for creating a Stripe Checkout session
router.post('/create-checkout-session', createCheckoutSession);

export default router;