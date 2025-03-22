import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Toaster, toast } from "react-hot-toast"; // Import react-hot-toast

export const SignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    
      const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (user.password !== user.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
    
        toast.success("Account created successfully. Please check your email to verify your account.");
        navigate("/login");
    
        axios
          .post("http://localhost:3000/api/auth/register", user)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
      });
      };

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} /> {/* Toast container */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white backdrop-blur-md rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-zinc-900">Register</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Full name"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
                className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="telephone"
                placeholder="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                required
                className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-3xl py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-green-600 hover:bg-green-700 py-3 text-xl text-white"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>

          <div className="text-center">
          <p className="mt-4 text-sm text-gray-600">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};
