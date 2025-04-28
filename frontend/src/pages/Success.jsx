import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Navbar } from "../components/Navbar";

export const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

        if (!user._id || cartItems.length === 0) {
          toast.error("Invalid order data");
          navigate("/");
          return;
        }

        // Process the order after successful payment
        await axios.post("http://localhost:3000/api/order-history/process-payment", {
          userId: user._id,
          cartItems: cartItems
        });

        // Clear cart items from localStorage
        localStorage.removeItem("cartItems");
        
        toast.success("Order processed successfully!");
      } catch (error) {
        console.error("Error processing order:", error);
        toast.error("Failed to process order");
      }
    };

    processOrder();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="mb-5 text-2xl font-bold text-green-900">Payment Successful!</h1>
        <p className="mb-5 text-gray-600">Thank you for your purchase.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Return to Home
        </button>
      </div>
    </>
  );
};

export default Success; 