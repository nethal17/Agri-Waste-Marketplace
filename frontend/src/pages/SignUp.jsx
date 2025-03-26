import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Toaster, toast } from "react-hot-toast";

export const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "buyer",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePassword = (password) => 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = {};

    if (!validateName(user.name)) {
      validationErrors.name = "Name should contain only letters and spaces.";
    }
    if (!validateEmail(user.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!validatePhone(user.phone)) {
      validationErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!validatePassword(user.password)) {
      validationErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    }
    if (user.password !== user.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    axios
      .post("http://localhost:3000/api/auth/register", user)
      .then((res) => {
        toast.success(
          "Account created successfully. Please check your email to verify your account."
        );
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Registration failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-zinc-900">Register</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full name"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <input
                type="telephone"
                placeholder="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div className="mb-4">
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-400 text-md rounded-3xl focus:outline-none focus:ring-5 focus:ring-green-500"
              >
                <option value="" disabled>Select Role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="truck_driver">Truck Driver</option>
              </select>
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xl text-white bg-green-600 rounded-2xl hover:bg-green-700"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-4 text-sm text-gray-600 mx-[100px]">
              Already a member?{" "}
              <Link to="/login" className="font-semibold text-green-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
