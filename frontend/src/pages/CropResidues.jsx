import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { FaShoppingCart } from "react-icons/fa"; // Import cart icon
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export const CropResidues = () => {
  const { waste_type } = useParams(); 
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Track cart items

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/agri-waste/waste/${encodeURIComponent(waste_type)}`
        );
        setWasteData(response.data);
      } catch (error) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching crop residues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteData();

    // Load cart count from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cartItems.length);
  }, [waste_type]);

  const handleAddToCart = (waste) => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || []; 
    const newItem = { ...waste, quantity: 1 }; 
    cartItems.push(newItem); 
    localStorage.setItem("cart", JSON.stringify(cartItems)); 
    setCartCount(cartItems.length); // Update cart count
    toast.success(`${waste.description} added to cart!`); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      {/* Cart Icon in Top-Right Corner */}
      <div className="relative">
        <Link to="/cart" className="absolute top-4 right-6 flex items-center">
          <FaShoppingCart className="text-3xl text-purple-600" />
          {cartCount > 0 && (
            <span className="bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Waste Materials</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {wasteData.length > 0 ? (
            wasteData.map((waste) => (
              <div key={waste._id} className="border p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{waste.description}</h2>
                  <p>District: {waste.district}</p>
                  <p>Quantity: {waste.quantity}</p>
                  <p>Price: {waste.price}</p>
                  <p>Expire Date: {new Date(waste.expire_date).toLocaleDateString()}</p>
                </div>
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                  onClick={() => handleAddToCart(waste)}
                >
                  Add To Cart
                </button>
              </div>
            ))
          ) : (
            <p>No Crop Residues found.</p>
          )}
        </div>
      </div>
    </>
  );
};
