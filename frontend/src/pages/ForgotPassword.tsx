import { useState } from "react";
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Toaster, toast } from "sonner"; // Toast notifications
import axios from "axios";
//import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } 
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email.");

    } catch (error) {
      toast.error("Failed to send password reset link.");
      console.error(error);
    }

    if (!email) {
      toast.error("Please enter your email to reset the password.");
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 bg-white backdrop-blur-md rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-900">Forgot Password</h2>
        </div>
        <form onSubmit={resetPassword}>
          <div className="mb-6">
            <Input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full rounded-3xl py-6"
            />
          </div>
          
          <div className="mb-6">
            <Button
              type="submit"
              className="cursor-pointer w-full rounded-2xl bg-green-600 hover:bg-green-800 py-6 text-xl"
            >
              Send Link
            </Button>
          </div>
        </form>

        
      </div>
      </div>
    </div>
  );
}
