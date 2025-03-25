import BuyerAddress from "../models/buyerAddress.model.js";

// Save a new buyer address
export const createBuyerAddress = async (req, res) => {
  try {
    const newAddress = new BuyerAddress(req.body);
    await newAddress.save();
    res.status(201).json({ message: "Buyer address saved successfully", data: newAddress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save buyer address" });
  }
};

// Get all buyer addresses
export const getBuyerAddresses = async (req, res) => {
  try {
    const addresses = await BuyerAddress.find();
    res.json(addresses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch buyer addresses" });
  }
};