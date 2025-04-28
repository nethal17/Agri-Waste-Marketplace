import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Navbar } from "../components/Navbar";
import axios from "axios";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData._id;

  useEffect(() => {
    const fetchCartItems = async () => {

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

    fetchCartItems();
  }, [navigate]);

  // Function to update item quantity
  const updateQuantity = async (wasteId, change) => {
    try {
      
      if (!userId) {
        toast.error('Please login to update cart');
        navigate('/login');
        return;
      }

      const item = cartItems.find(item => item.wasteId === wasteId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        await removeItem(wasteId);
        return;
      }

      const response = await axios.put('http://localhost:3000/api/cart/update', {
        userId,
        wasteId,
        quantity: newQuantity
      });

      if (response.data) {
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.wasteId === wasteId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        toast.success("Cart updated successfully");
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update cart');
    }
  };

  // Function to remove item from cart
  const removeItem = async (wasteId) => {
    try {
      
      if (!userId) {
        toast.error('Please login to remove items');
        navigate('/login');
        return;
      }

      const response = await axios.delete('http://localhost:3000/api/cart/remove', {
        data: { userId, wasteId }
      });

      if (response.data) {
        setCartItems(prevItems => prevItems.filter(item => item.wasteId !== wasteId));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + ((item.price* item.quantity) + item.deliveryCost);
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Shopping Cart</h2>
          
          {cartItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Subtotal</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Delivery Cost</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.wasteId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-20 h-20">
                              {item.image ? (
                                <img
                                  className="object-cover w-20 h-20 rounded-md"
                                  src={item.image}
                                  alt={item.wasteItem}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-md">
                                  <span className="text-sm text-gray-500">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.wasteItem}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            
                            <span className="text-gray-700">{item.quantity}</span>
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Rs. {item.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Rs. {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Rs. {item.deliveryCost.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeItem(item.wasteId)}
                            className="text-red-600 transition-colors hover:text-red-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-8 mt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/organic-waste')}
                      className="px-6 py-3 text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">Rs. {calculateTotal().toFixed(2)}</p>
                    <button 
                      onClick={() => {
                        navigate('/buyer-address-form');
                        toast.success("Proceeding to checkout...");
                      }}
                      className="px-6 py-3 mt-4 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-2 text-sm text-gray-500">Start adding some items to your cart!</p>
              <button
                onClick={() => navigate('/organic-waste')}
                className="px-6 py-3 mt-6 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};