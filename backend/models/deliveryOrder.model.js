import mongoose from "mongoose";

const deliveryOrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["toDeliver", "toReceive"], default: "toDeliver" }
}, { timestamps: true });

export const DeliveryOrder = mongoose.model("DeliveryOrder", deliveryOrderSchema);