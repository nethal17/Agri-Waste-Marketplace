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

// Get address by buyer ID  
export const getAddressByBuyerId = async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    if (!buyerId) {
      return res.status(400).json({ error: "Buyer ID is required" });
    }

    // Find address for the specific buyer
    const address = await BuyerAddress.findOne({ buyerId });
    
    if (!address) {
      return res.status(404).json({ message: "Address not found for this buyer" });
    }
    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching buyer address:", error);
    res.status(500).json({ error: "Failed to fetch buyer address" });
  }
};