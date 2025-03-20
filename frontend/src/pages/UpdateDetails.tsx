import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const UpdateDetails = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found, please login again.");
          return;
        }

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id;

        const response = await axios.get(
          `http://localhost:3000/api/auth/searchUser/${userId}`
        );

        setUser({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          password: "", // Do not prefill password for security reasons
          confirmPassword: "",
        });

      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.phone) {
      toast.error("All fields are required.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData._id;

      const updatePayload = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        ...(user.password && { password: user.password }), // Only send password if user entered a new one
      };

      await axios.put(
        `http://localhost:3000/api/auth/updateUser/${userId}`,
        updatePayload
      );

      toast.success("User details updated successfully!");
      navigate("/profile"); // Redirect after update

    } catch (error) {
      toast.error("Failed to update details.");
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
        <div className="w-full max-w-md p-8 bg-white backdrop-blur-md rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-zinc-900">Edit Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              className="w-full rounded-3xl py-6"
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full rounded-3xl py-6"
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
              className="w-full rounded-3xl py-6"
            />
            <Input
              type="password"
              placeholder="New Password (Leave empty to keep current)"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full rounded-3xl py-6"
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-3xl py-6 mb-9"
            />
            <Button
              type="submit"
              className="w-full rounded-2xl bg-green-600 hover:bg-green-700 py-6 text-xl"
            >
              Update
            </Button>
          </form>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};
