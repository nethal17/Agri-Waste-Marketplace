import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // 5-star rating
  review: { type: String, required: true },
  image: { type: String }, // New field to store image path
  status: { type: String, enum: ['pending', 'published'], default: 'pending' }, // Review status
  createdAt: { type: Date, default: Date.now },
});
export default reviewSchema;