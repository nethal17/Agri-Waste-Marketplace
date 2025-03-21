import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin", "organic_seller", "truck_driver"], default: "farmer" },
    profilePic: { type: String, default: "https://via.placeholder.com/150" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    isVerified: { type: Boolean, default: false }, 
    verificationToken: { type: String }, 
    twoStepVerificationCode: { type: String }, 
    twoStepVerificationExpire: { type: Date } 

}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);