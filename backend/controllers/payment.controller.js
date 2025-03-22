import { Payment } from '../models/payment.model.js';

// Fetch all payment histories
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('driver', 'name'); // Populate driver details
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};