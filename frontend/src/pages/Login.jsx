import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Toaster, toast } from "react-hot-toast";
import { TwoStepVerification } from "../components/TwoStepVerification";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data.requiresVerification) {
        setUserEmail(email);
        setShowVerification(true);
        toast.success('Verification code sent to your email');
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return <TwoStepVerification email={userEmail} />;
  }

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} /> {/* Toast container */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-zinc-900">LOGIN</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xl text-white bg-green-600 rounded-2xl hover:bg-green-700"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
            <p className="justify-center mt-4 text-sm text-gray-600 mx-[100px]">
              Not a member yet?{" "}
              <Link
                to="/register"
                className="font-semibold text-green-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
