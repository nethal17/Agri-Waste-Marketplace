import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export const Cart = () => {
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to get user details from local storage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found, please login again.");
          navigate("/login");
          return;
        }
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
        fetchCart(userData._id);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Function to get cart items for relevant user from database
  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Cart doesn't exist yet, create an empty one
        setCart({ items: [], totalPrice: 0 });
      } else {
        toast.error("Failed to fetch cart items.");
        console.error(error);
      }
    }
  };

  // Function to update item quantity
  const updateQuantity = async (wasteId, change) => {
    if (!user || !cart) return;
    
    try {
      const item = cart.items.find(item => item.wasteId === wasteId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        // If quantity would be 0, remove the item instead
        await removeItem(wasteId);
        return;
      }

      const response = await axios.put("http://localhost:3000/api/cart/update", {
        userId: user._id,
        wasteId,
        quantity: newQuantity
      });

      setCart(response.data);
      toast.success("Quantity updated successfully");
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error(error);
    }
  };

  // Function to remove item from cart
  const removeItem = async (wasteId) => {
    if (!user) return;
    
    try {
      const response = await axios.delete("http://localhost:3000/api/cart/remove", {
        userId: user._id,
        wasteId
      });

      setCart(response.data);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-500">My Cart</h2>
        <p className="mt-4">Please login to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-red-500">My Cart</h2>
      
      {cart?.items?.length > 0 ? (
        <>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-red-100">
                <th className="p-2 text-left">Description</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Price</th>
                <th className="text-left">Delivery</th>
                <th className="text-left">Subtotal</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.wasteId} className="border-b">
                  <td className="p-2">{item.description}</td>
                  <td>
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-300 rounded-l"
                        onClick={() => updateQuantity(item.wasteId, -1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-300 rounded-r"
                        onClick={() => updateQuantity(item.wasteId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>Rs. {item.price.toFixed(2)}</td>
                  <td>Rs. {item.deliveryCost.toFixed(2)}</td>
                  <td>Rs. {(item.price * item.quantity + item.deliveryCost).toFixed(2)}</td>
                  <td>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded"
                      onClick={() => removeItem(item.wasteId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 mt-4 bg-gray-100 rounded">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: Rs. {cart.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-4 text-center text-gray-500">Your cart is empty.</p>
      )}

      <div className="flex justify-between mt-4">
        <button 
          className="px-4 py-2 text-white bg-purple-600 rounded"
          onClick={() => navigate("/organic-waste")}
        >
          Continue Shopping
        </button>
        {cart?.items?.length > 0 && (
          <button 
            className="px-4 py-2 text-white bg-purple-600 rounded"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};