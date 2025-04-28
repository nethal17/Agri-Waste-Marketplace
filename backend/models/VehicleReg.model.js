import mongoose from "mongoose";

const vehicleRegSchema  = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nic: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  address: { type: String, required: true },
  preferredDistrict: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  licenseCopyUrl: { type: String }, // Optional: for file upload
}, { timestamps: true });

export const VehicleReg = mongoose.model("VehicleReg", vehicleRegSchema);