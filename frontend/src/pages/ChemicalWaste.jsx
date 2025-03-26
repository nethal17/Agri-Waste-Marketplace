import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { toast } from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

export const ChemicalWaste = () => {
  const { waste_type } = useParams(); // Extract waste type from URL params
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchWasteData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/agri-waste/waste/${encodeURIComponent(waste_type)}`
        );
        setWasteData(response.data);
      } catch (error) {
        console.error("Error fetching crop residues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteData();
  }, [waste_type]);

  const handleAddToCart = (waste) => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || []; // Get existing cart
    cartItems.push(waste); // Add new item
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Save updated cart
    alert(`${waste.description} added to cart!`); // Show confirmation message
  };

  if (loading) return <p>Loading...</p>;

 return (
       <>
         <Navbar />
          <Link to="/cart">
                <div className="justify-center justify place-items-end mt-[35px] px-[50px]">
                <FaShoppingCart size={35} className="text-green-600 cursor-pointer"/>
                </div>
                </Link>

         <div className="container mx-auto p-4">
           <h1 className="text-2xl font-bold text-center" >Waste Materials</h1>
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
                     className="bg-green-600 text-white px-4 py-2 rounded"
                     onClick={() => handleAddToCart(waste)} // Call function on click
                   >
                     Add To Cart
                   </button>
                 </div>
               ))
             ) : (
               <p>No Chemical Waste found.</p>
             )}
           </div>
         </div>
       </>
     );
   };