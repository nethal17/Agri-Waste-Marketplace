"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

export const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      axios.post("http://localhost:3000/api/auth/verify-two-step-code", { otp });

      toast.success("OTP Verified! Redirecting...");
      setTimeout(() => {
        navigate("/dash");
      }, 1500);
      
    } catch (error) {
      toast.error("Invalid OTP. Try again!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
        <p className="text-center text-gray-600 mb-4">A 6-digit code was sent to your email.</p>
        <div className="flex items-center justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        </div>
        <Button onClick={handleVerifyOTP} className="w-full mt-4" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};
