import express from 'express';
import { createPayment, getAllPayments } from '../controllers/payment.controller.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


router.post('/payments', createPayment);
router.get('/payments', getAllPayments);

// Add new Stripe route with a distinct name
router.post('/stripe/checkout', async (req, res) => {
  try {
    const { userId, cartId, amount, currency } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency.toLowerCase() || 'lkr',
          product_data: {
            name: 'Organic Waste Purchase',
          },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      metadata: {
        userId,
        cartId
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;