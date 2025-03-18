import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Account created successfully. Please check your email to verify your account.");

    axios
      .post("http://localhost:3000/api/auth/register", user)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
  });
};

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="w-full max-w-md p-8 bg-white backdrop-blur-md rounded-lg shadow-2xl">
      <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-zinc-900">Register</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Full Name" name="name" value={user.name} onChange={handleChange} required className="w-full rounded-3xl py-6"/>
          <Input type="email" placeholder="Email" name="email" value={user.email} onChange={handleChange} required className="w-full rounded-3xl py-6"/>
          <Input type="telephone" placeholder="Phone Number" name="phone" value={user.phone} onChange={handleChange} required className="w-full rounded-3xl py-6"/>
          <Input type="password" placeholder="Password" name="password" value={user.password} onChange={handleChange} required className="w-full rounded-3xl py-6"/>
          <Input type="password" placeholder="Confirm Password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required className="w-full rounded-3xl py-6 mb-9"/>
          <Button type="submit" className="w-full rounded-2xl bg-green-600 hover:bg-green-700 py-6 text-xl">Register</Button>
        </form>

        <div className="text-center">
          <p className="mt-4 text-sm text-gray-600">
            Already a member?{" "}
            <Link
              to="/auth/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Toaster position="top-center" richColors /> {/* Sonner Toaster */}
      </div>
    </div>
  )
};
