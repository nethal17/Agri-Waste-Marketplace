import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";

export const CropResidues = () => {
  const { waste_type } = useParams(); 
  const [wasteData, setWasteData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ text: "", isError: false });

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
  }, [waste_type]);

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
        const response = await axios.get(`http://localhost:3000/api/auth/searchUser/${userId}`);
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleAddToCart = async (waste) => {
    
    if (!user) {
      setCartMessage({ text: "Please login to add items to cart", isError: true });
      return;
    }
    
    setAddingToCart(true);
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/cart/add",
        {
          userId : user._id, // Assuming your auth context provides user._id
          wasteId: waste._id,
          description: waste.description,
          price: waste.price,
          deliveryCost: 300, // You can calculate this dynamically if needed
          quantity: 1 // Default quantity, can be made adjustable
        }
      );

      setCartMessage({ text: "Item added to cart successfully!", isError: false });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartMessage({ text: "Failed to add item to cart", isError: true });
    } finally {
      setAddingToCart(false);
      // Clear message after 3 seconds
      setTimeout(() => setCartMessage({ text: "", isError: false }), 3000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      
      <div className="relative">
        {cartMessage.text && (
          <div className={`fixed top-20 right-4 p-4 rounded shadow-lg z-50 
            ${cartMessage.isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {cartMessage.text}
          </div>
        )}
      </div>

      <div className="container p-4 mx-auto">
        <h1 className="text-2xl font-bold">Waste Materials</h1>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {wasteData.length > 0 ? (
            wasteData.map((waste) => (
              <div key={waste._id} className="flex items-center justify-between p-4 border rounded shadow">
                <div>
                  <h2 className="text-xl font-semibold">{waste.description}</h2>
                  <p>District: {waste.district}</p>
                  <p>Quantity: {waste.quantity}</p>
                  <p>Price: {waste.price}</p>
                  <p>Expire Date: {new Date(waste.expire_date).toLocaleDateString()}</p>
                </div>
                <button 
                  className={`px-4 py-2 text-white rounded ${addingToCart ? 'bg-gray-500' : 'bg-purple-600'}`}
                  onClick={() => handleAddToCart(waste)}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add To Cart'}
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