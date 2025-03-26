import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin", "truck_driver"], default: "buyer" },
    profilePic: { type: String, default: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    isVerified: { type: Boolean, default: false }, 
    verificationToken: { type: String }, 
    twoStepVerificationCode: { type: String }, 
    twoStepVerificationExpire: { type: Date } 

}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);