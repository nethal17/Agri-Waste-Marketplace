import mongoose from "mongoose";

// Define the schema
const buyerAddressSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    default: 119
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  saveInfo: { 
    type: Boolean, 
    required: true 
  },
});

const BuyerAddress = mongoose.model("BuyerAddress", buyerAddressSchema);

export default BuyerAddress;