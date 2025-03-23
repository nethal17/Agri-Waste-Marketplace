import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getDriverPayments = async (req, res) => {
  const { driverId } = req.params; // Get driverId from the request params

  try {
    // Fetch all checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100, // Adjust the limit as needed
    });

    console.log('All sessions:', sessions.data); // Debugging: Log all sessions

    // Filter sessions to include only driver payments for the specified driverId
    const driverPayments = sessions.data
      .filter(session => session.metadata.type === 'driver' && session.metadata.driverId === driverId)
      .map(session => ({
        id: session.id,
        driverName: session.metadata.driverName || 'Unknown', // Use metadata to get driver name
        payAmount: session.amount_total / 100, // Convert from cents to dollars
        paymentDate: new Date(session.created * 1000).toLocaleDateString(), // Convert timestamp to date
      }));

    console.log('Filtered driver payments:', driverPayments); // Debugging: Log filtered payments

    res.status(200).json(driverPayments);
  } catch (error) {
    console.error('Error fetching driver payments:', error); // Debugging: Log errors
    res.status(500).json({ error: error.message });
  }
};