import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export const ProductListingForm = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login to list agri-waste");
    navigate("/login");
  }
  
  const [formData, setFormData] = useState({
    wasteCategory: "",
    wasteType: "",
    wasteItem: "",
    province: "",
    district: "",
    city: "",
    quantity: "",
    price: "",
    description: "",
    expireDate: "",
    image: null,
  });

  const [wasteTypes, setWasteTypes] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const verifyToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Token payload:", payload);
        
        if (!payload.userId && !payload._id && !payload.id) {
          console.error("Token is missing user identification");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    verifyToken();
  }, []);

  // Fetch Provinces (if needed)
  useEffect(() => {
    const provinces = [
      "Nothern Province",
      "North Central Province",
      "North Western Province",
      "Western Province",
      "Central Province",
      "Sabaragamuwa Province",
      "Southern Province",
      "Uva Province",
      "Eastern Province",
    ];
    setProvinces(provinces);
  }, []);

  // Fetch Waste Types based on Waste Category
  useEffect(() => {
    if (formData.wasteCategory) {
      fetch(`http://localhost:3000/api/product-listing/waste-types/${formData.wasteCategory}`)
        .then((res) => res.json())
        .then((data) => setWasteTypes(data))
        .catch((error) => toast.error("Failed to fetch waste types"));
    }
  }, [formData.wasteCategory]);

  // Fetch Waste Items based on Waste Type
  useEffect(() => {
    if (formData.wasteType) {
      fetch(`http://localhost:3000/api/product-listing/waste-items/${formData.wasteType}`)
        .then((res) => res.json())
        .then((data) => setWasteItems(data))
        .catch((error) => toast.error("Failed to fetch waste items"));
    }
  }, [formData.wasteType]);

  // Fetch Districts based on Province
  useEffect(() => {
    if (formData.province) {
      fetch(`http://localhost:3000/api/product-listing/districts/${formData.province}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((error) => toast.error("Failed to fetch districts"));
    }
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? e.target.files?.[0] || null : value,
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData?._id) {
        toast.error("User information is missing. Please log in again.");
        return;
    }

    // Verify the farmerId format before sending
    if (!/^[0-9a-fA-F]{24}$/.test(userData._id)) {
        toast.error("Invalid user ID format. Please log in again.");
        return;
    }

    // Validate inputs
    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity, 10);

    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }

    try {
      let photo = "";
      if (formData.image) {
        photo = await convertToBase64(formData.image);
      }

      const payload = {
        wasteCategory: formData.wasteCategory,
        wasteType: formData.wasteType,
        wasteItem: formData.wasteItem,
        province: formData.province,
        district: formData.district,
        city: formData.city,
        quantity,
        price,
        description: formData.description,
        expireDate: formData.expireDate,
        photo
      };

      const response = await fetch("http://localhost:3000/api/product-listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Backend error response:", responseData);
        throw new Error(responseData.message || responseData.error?.message || "Submission failed");
    }

      toast.success(responseData.message || "Product listing submitted! Status: Pending");
      
      // Reset form
      setFormData({
        wasteCategory: "",
        wasteType: "",
        wasteItem: "",
        province: "",
        district: "",
        city: "",
        quantity: "",
        price: "",
        description: "",
        expireDate: "",
        image: null,
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Submission failed. Please try again.");
    }
  };


  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Add New Product Listing</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same as in your original code */}
            {/* Waste Category (Radio Buttons) */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Waste Category</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="wasteCategory"
                    value="Organic Waste"
                    checked={formData.wasteCategory === "Organic Waste"}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-500 form-radio"
                    required
                  />
                  <span className="text-gray-700">Organic Waste</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="wasteCategory"
                    value="Inorganic Waste"
                    checked={formData.wasteCategory === "Inorganic Waste"}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-500 form-radio"
                    required
                  />
                  <span className="text-gray-700">Inorganic Waste</span>
                </label>
              </div>
            </div>

            {/* Waste Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Waste Type</label>
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Waste Type</option>
                {wasteTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Waste Item */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Waste Item</label>
              <select
                name="wasteItem"
                value={formData.wasteItem}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Waste Item</option>
                {wasteItems.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Quantity (1 Kg)</label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Price (Per Unit)</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Enter a detailed description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                rows={4}
              />
            </div>

            {/* Expire Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Expire Date</label>
              <input
                type="date"
                name="expireDate"
                value={formData.expireDate}
                onChange={handleChange}
                className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Upload Product Image (*Optianal)</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full p-2 bg-gray-100 border rounded-lg cursor-pointer file:bg-green-500 file:text-white file:py-2 file:px-4 file:border-none file:rounded-lg hover:file:bg-green-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 text-white transition-all duration-200 bg-green-500 rounded-lg hover:bg-green-600"
            >
              Submit Listing
            </button>
          </form>
        </div>
      </div>
    </>
  );
};