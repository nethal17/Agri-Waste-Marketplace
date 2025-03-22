import { useState } from "react";
import { Toaster, toast } from "react-hot-toast"; // Toast notifications
import axios from "axios";
import { Navbar } from "../components/Navbar";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } 
  };

  const resetPassword = async (e) => {
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
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 py-3 text-xl text-white"
              disabled={loading}
            >
              {loading ? "Sending link..." : "Send Link"}
            </button>
          </div>
        </form>

        
      </div>
      </div>
    </div>
  );
}
