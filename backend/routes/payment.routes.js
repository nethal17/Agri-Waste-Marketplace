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
    const { userId, cartId, amount, currency, success_url, cancel_url, customerEmail } = req.body;

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
      success_url: success_url || `${req.headers.origin}/success`,
      cancel_url: cancel_url || `${req.headers.origin}/checkout`,
      metadata: {
        userId,
        cartId,
        customerEmail
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;