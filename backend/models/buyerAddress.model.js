import mongoose from "mongoose";

const buyerAddressSchema = new mongoose.Schema({
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