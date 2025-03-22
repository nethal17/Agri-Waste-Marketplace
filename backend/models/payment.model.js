import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver', // Reference to the Driver model
      required: true,
    },
    payAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const Payment = mongoose.model('Payment', paymentSchema);