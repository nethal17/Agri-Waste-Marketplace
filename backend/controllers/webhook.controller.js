import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Payment } from '../models/payment.model.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Extract payment details from the session
      const paymentData = {
        driverId: session.metadata.driverId,
        driverName: session.metadata.driverName,
        payAmount: session.amount_total / 100, // Convert from cents to dollars
      };

      // Save the payment to your database
      await Payment.create(paymentData);

      console.log('Payment saved:', paymentData);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
};