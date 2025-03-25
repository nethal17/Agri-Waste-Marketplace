import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

export const Checkout = () => {
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view your cart");
          navigate("/login");
          return;
        }
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
        await fetchCart(userData._id);
      } catch (error) {
        toast.error("Failed to load user data");
        console.error("User data error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe('pk_test_51R1MPn02Tln9XO2Pw0O2KdyFoYGjTVHjsfD7SXT7yLTuzA00iYnUSj1Bh9fxN3GabW3Ud2DVaMssJvoV8ODbHgWc00m3XhcXZ0');
        setStripe(stripeInstance);
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
        toast.error("Payment system initialization failed");
      }
    };
    initializeStripe();
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setCart({ items: [], totalPrice: 0 });
      } else {
        toast.error("Failed to load cart items");
        console.error("Cart fetch error:", error);
      }
    }
  };

  const fetchAddress = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/address/get-address/${userId}`);
        setAddress(response.data);
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error("Failed to load address");
          console.error("Address fetch error:", error);
        }
      }
  };

  useEffect(() => {
      if (user && user._id) {
        fetchAddress(user._id);
      }
  }, [user]);
  
  const handlePayment = async () => {
    if (!user || !cart || cart.items.length === 0 || !stripe) {
      toast.error("Cannot process payment");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/stripe/checkout",
        {
          userId: user._id,
          cartId: cart._id || 'temp-cart',
          amount: Math.round(cart.totalPrice * 100), // Convert to cents
          currency: "LKR"
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id
      });

      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="mb-5 text-2xl font-bold text-red-600">Your cart is empty</h1>
        <button 
          onClick={() => navigate("/organic-waste")} 
          className="px-4 py-2 text-white bg-purple-600 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-white">
      <h1 className="mb-5 text-2xl font-bold text-red-600">Check Out</h1>

      {/* Shipping Address Section */}
      <div className="w-3/4 p-4 mb-5 rounded-lg shadow-sm bg-red-50">
        <h2 className="text-lg font-bold">Shipping Address</h2>
        {address ? (
          <>
            <p>{address.address}</p>
            <p>{address.city}</p>
            {address.postalCode && <p>Postal Code: {address.postalCode}</p>}
            {address.phone && <p>Phone: {address.phone}</p>}
          </>
        ) : (
          <p>No shipping address found. Please add one.</p>
        )}
      </div>

      {/* Cart Items Table */}
      <div className="w-3/4 p-4 rounded-lg shadow-sm bg-red-50">
        <table className="w-full">
          <thead>
            <tr className="font-bold text-left text-md">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Delivery Price</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.description}</td>
                <td className="p-2">Rs. {item.price.toFixed(2)}</td>
                <td className="p-2">Rs. {item.deliveryCost.toFixed(2)}</td>
                <td className="p-2">Rs. {(item.price * item.quantity + item.deliveryCost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Price Section */}
      <div className="w-3/4 p-4 mt-5 text-right rounded-lg shadow-sm bg-red-50">
        <h2 className="text-lg font-bold">
          Total Price: Rs. {cart.totalPrice.toFixed(2)}
        </h2>
      </div>

      {/* Checkout Button */}
      <div className="w-3/4 mt-5">
        <button
          onClick={handlePayment}
          disabled={!address || isProcessingPayment}
          className={`w-full py-2 px-4 rounded text-white ${address ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {address ? "Proceed to Payment" : "Add Shipping Address First"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;