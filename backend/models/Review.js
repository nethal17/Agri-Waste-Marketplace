import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  status: { type: String, enum: ['pending', 'published'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);
export default Review;