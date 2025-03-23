import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getStripePayments = async (req, res) => {
  try {
    // Fetch all checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100, // Adjust the limit as needed
    });

    // Map sessions to a simpler format for the frontend
    const payments = sessions.data.map(session => ({
      id: session.id,
      driverName: session.metadata.driverName || 'Unknown', // Use metadata to get driver name
      payAmount: session.amount_total / 100, // Convert from cents to dollars
      paymentDate: new Date(session.created * 1000).toLocaleDateString(), // Convert timestamp to date
    }));

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};