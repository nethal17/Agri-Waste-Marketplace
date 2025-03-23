import { Payment } from '../models/payment.model.js';

export const createPayment = async (req, res) => {
  const { driverId, driverName, payAmount } = req.body;

  try {
    const payment = await Payment.create({ driverId, driverName, payAmount });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }); // Fetch all payments, sorted by latest first
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};