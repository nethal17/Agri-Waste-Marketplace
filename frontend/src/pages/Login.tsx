import { useState } from "react";
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Toaster, toast } from "sonner"; // Toast notifications
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      // Store token and user details in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/dash");
      }, 1500);
    } catch (error) {
      toast.error("Login failed!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset the password.");
      return;
    }
  
    try {
      await axios.post("http://localhost:3000/api/auth/reset-password", { email });
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error("Failed to send password reset link.");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 bg-white backdrop-blur-md rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-zinc-900">LOGIN</h2>
        </div>
        <form onSubmit={handleLogin}>
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
            <Input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full rounded-3xl py-6"
            />
          </div>
          <div className="mb-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-green-600 hover:bg-green-700 py-6 text-xl"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="text-center">
    <Link to="/auth/reset-password"    
    className="text-sm text-red-500 font-semibold hover:underline"
    >
    Forgot Password?
    </Link>
          <p className="mt-4 text-sm text-gray-600">
            Not a member yet?{" "}
            <Link
              to="/auth/signup"
              className="text-green-600 font-semibold hover:underline"
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