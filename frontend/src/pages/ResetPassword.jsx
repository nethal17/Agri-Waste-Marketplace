import { useState } from "react";
import { Toaster, toast } from "react-hot-toast"; // Toast notifications
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      toast.success("Password successfully reset.");
      navigate("/login"); // Redirect to login page after successful reset
    } catch (error) {
      toast.error("Failed to reset password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
        <Toaster position="top-center" />
        <div className="w-full max-w-md p-8 bg-white backdrop-blur-md rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-zinc-900">Reset Password</h2>
          </div>
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <input
                type="password"
                placeholder="New Password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};