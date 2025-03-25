import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const BuyerAddressForm = () => {
  const navigate = useNavigate(); // ✅ Define navigate
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    saveInfo: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.saveInfo) {
      setError("You must agree to save the information.");
      return;
    }

    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/buyer-address/add", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Address saved successfully!");
        setFormData({
          address: "",
          city: "",
          postalCode: "",
          phone: "",
          saveInfo: false,
        });
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error saving address:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to save address.");
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded shadow-md mt-[130px]">
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code (optional)"
          value={formData.postalCode}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            name="saveInfo"
            checked={formData.saveInfo}
            onChange={handleChange}
            className="mr-2"
            required
          />
          <label>Save this information</label>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700">
          Submit
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <button className="bg-green-700 text-white px-4 py-2" onClick={() => navigate("/checkout")}>
          CheckOut
        </button>
      </div>
    </>
  );
};
