import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { totalSalary } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr', // Sri Lankan Rupees
            product_data: {
              name: 'Driver Salary Payment',
            },
            unit_amount: totalSalary * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`, // Redirect after successful payment
      cancel_url: `${process.env.FRONTEND_URL}/cancel`, // Redirect if payment is canceled
    });

    res.json({ url: session.url }); // Return the Stripe Checkout URL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};