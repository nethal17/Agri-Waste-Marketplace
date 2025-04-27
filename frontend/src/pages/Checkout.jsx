import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

export const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
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
        await fetchCartItems(userData._id);
        await fetchAddress(userData._id);
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

  const fetchCartItems = async (userId) => {
        try {
          
          if (!userId) {
            toast.error('Please login to view your cart');
            navigate('/login');
            return;
          }
          const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
          if (response.data) {
            setCartItems(response.data.items);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          toast.error('Failed to load cart items');
        } finally {
          setLoading(false);
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

  const handlePayment = async () => {
    if (!user || cartItems.length === 0 || !stripe) {
      toast.error("Cannot process payment");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // First, insert cart items into order history
      for (const item of cartItems) {
        const orderData = {
          userId: user._id,
          productName: item.description,
          quantity: item.quantity || 1,
          totalPrice: item.price * (item.quantity || 1)
        };

        await axios.post("http://localhost:3000/api/order-history/add", orderData);
      }

      // Format cart items for Stripe
      const line_items = cartItems.map(item => ({
        price_data: {
          currency: 'lkr',
          product_data: {
            name: item.description || 'Product'
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      }));

      // Add delivery cost as a separate line item
      const totalDeliveryCost = cartItems.reduce((total, item) => total + (item.deliveryCost || 0), 0);
      if (totalDeliveryCost > 0) {
        line_items.push({
          price_data: {
            currency: 'lkr',
            product_data: {
              name: 'Delivery Cost'
            },
            unit_amount: Math.round(totalDeliveryCost * 100), // Convert to cents
          },
          quantity: 1,
        });
      }

      const response = await axios.post(
        "http://localhost:3000/api/stripe/checkout",
        {
          userId: user._id,
          cartId: 'temp-cart',
          line_items: line_items,
          currency: "LKR",
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/checkout`,
          customerEmail: user.email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Backend response:', response.data);

      if (response.data.url) {
        // If we get a URL directly, redirect to it
        window.location.href = response.data.url;
        return;
      }

      // If we get a session ID, use the Stripe redirect
      const sessionId = response.data.id || response.data.sessionId || response.data.session?.id;
      
      if (!sessionId) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Payment error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      toast.error(error.response?.data?.error || `Payment failed: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + ((item.price* item.quantity) + item.deliveryCost);
    }, 0);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (cartItems.length === 0) {
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
      <h1 className="mb-5 text-2xl font-bold text-green-900">Check Out</h1>

      {/* Shipping Address Section */}
      <div className="w-3/4 p-4 mb-5 bg-green-100 rounded-lg shadow-sm">
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
      <div className="w-3/4 p-4 bg-green-100 rounded-lg shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="font-bold text-left text-md">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">Delivery Cost</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.description}</td>
                <td className="p-2">Rs. {item.price.toFixed(2)}</td>
                <td className="p-2">{item.quantity || 1}</td>
                <td className="p-2">Rs. {(item.price * (item.quantity || 1)).toFixed(2)}</td>
                <td className="p-2">Rs. {item.deliveryCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Price Section */}
      <div className="w-3/4 p-4 mt-5 text-right bg-green-100 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold">
          Total Price: Rs. {calculateTotal().toFixed(2)}
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