import mongoose from 'mongoose';

const ProductListingSchema = new mongoose.Schema({
  wasteCategory: { type: String, required: true, enum: ['Organic Waste', 'Inorganic Waste'] },
  wasteType: { type: String, required: true },
  wasteItem: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  expireDate: { type: Date, required: true },
  image: { type: String, optional: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('ProductListing', ProductListingSchema);