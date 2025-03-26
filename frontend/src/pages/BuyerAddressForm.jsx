import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { toast } from "react-toastify";

export const BuyerAddressForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    buyerId: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    saveInfo: false,
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingAddress, setExistingAddress] = useState(null);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/buyer-address/${userData._id}`);
        if (response.data) {
          setExistingAddress(response.data);
          setFormData({
            buyerId: userData._id,
            address: response.data.address,
            city: response.data.city,
            postalCode: response.data.postalCode,
            phone: response.data.phone,
            saveInfo: true
          });
          setIsEditing(true);
        } else {
          setFormData(prev => ({ ...prev, buyerId: userData._id }));
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Failed to fetch address data");
        }
        setFormData(prev => ({ ...prev, buyerId: userData._id }));
      }
    };

    if (userData._id) {
      fetchAddress();
    }
  }, [userData._id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.saveInfo) {
      toast.error("You must agree to save the information");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:3000/api/buyer-address/${formData.buyerId}`,
          formData
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/address/add",
          formData
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Address saved successfully!");
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-2xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Shipping Address</h1>
        
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="Street address or P.O. Box"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="For delivery updates"
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              id="saveInfo"
            />
            <label htmlFor="saveInfo" className="ml-2 text-gray-700">
              Save this information for next time
            </label>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'Saving...' : 'Continue to Checkout'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};