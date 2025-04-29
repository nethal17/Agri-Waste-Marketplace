import { User } from "../models/user.js";
import { VehicleReg as VehicleRegModel } from "../models/VehicleReg.model.js";  // <-- Renamed model
import bcrypt from "bcryptjs";

export const registerVehicle = async (req, res) => {  // <-- Renamed function
  try {
    const {
      nic, licenseNumber, licenseExpiry, address,
      preferredDistrict, vehicleType, vehicleNumber, email
    } = req.body;

    // 1. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Vehicle already exists" });

    // 2. Create truck driver profile
    const newVehicle = await VehicleRegModel.create({
      nic, licenseNumber, licenseExpiry, address,
      preferredDistrict, vehicleType, vehicleNumber,
    });

    res.status(201).json({ msg: "Vehicle registered", vehicle: newVehicle });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
