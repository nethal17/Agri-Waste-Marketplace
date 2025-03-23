import AgriWaste from "../models/agriWaste.model.js";

// Get all waste
export const getAllWaste = async (req, res) => {
  try {
    const waste = await AgriWaste.find({});
    res.json({ waste });
  } catch (error) {
    console.log("Error in getAllWaste controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// create waste
export const createWaste = async (req, res) => {
  try {
    const { waste_type, district, quantity, price, description, expire_date } = req.body;
    const waste = await AgriWaste.create({ waste_type, district, quantity, price, description, expire_date });
    res.status(201).json(waste);
  } catch (error) {
    console.log("Error in createWaste controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

