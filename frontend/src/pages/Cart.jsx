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
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
          
          {cartItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.wasteId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-20 w-20 flex-shrink-0">
                              {item.image ? (
                                <img
                                  className="h-20 w-20 object-cover rounded-md"
                                  src={item.image}
                                  alt={item.wasteItem}
                                />
                              ) : (
                                <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">No image</span>
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
                            <button
                              onClick={() => updateQuantity(item.wasteId, -1)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.wasteId, 1)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
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
                            className="text-red-600 hover:text-red-900 transition-colors"
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

              <div className="mt-8 border-t pt-8">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/organic-waste')}
                      className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
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
                      className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
                className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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