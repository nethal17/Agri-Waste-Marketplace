import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import axios from "axios";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Full Name" name="name" value={user.name} onChange={handleChange} required />
          <Input type="email" placeholder="Email" name="email" value={user.email} onChange={handleChange} required />
          <Input type="telephone" placeholder="Phone Number" name="phone" value={user.phone} onChange={handleChange} required />
          <Input type="password" placeholder="Password" name="password" value={user.password} onChange={handleChange} required />
          <Input type="password" placeholder="Confirm Password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
      <Toaster position="top-center" richColors /> {/* Sonner Toaster */}
    </div>
  )
};
