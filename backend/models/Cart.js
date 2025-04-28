import mongoose from "mongoose";

// Define the schema
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      wasteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Waste", required: true 
    },
      farmerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true
    },
      description: { 
        type: String, 
        required: true 
    },
      price: { 
        type: Number, 
        required: true 
    },
      quantity: { 
        type: Number, 
        required: true, 
        default: 1 
    },
      deliveryCost: { 
        type: Number, 
        required: true 
    }
    }
  ],
  totalPrice: { type: Number, required: true, default: 0 }
});

export default mongoose.model("Cart", CartSchema);