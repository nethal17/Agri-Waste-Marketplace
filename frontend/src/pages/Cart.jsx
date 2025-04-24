import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Navbar } from "../components/Navbar";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(items);
    };

    loadCartItems();
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', loadCartItems);
    
    return () => {
      window.removeEventListener('storage', loadCartItems);
    };
  }, []);

  // Function to update item quantity
  const updateQuantity = (productId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === productId) {
        const newQuantity = (item.cartQuantity || 1) + change;
        if (newQuantity < 1) return null;
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    toast.success("Cart updated successfully");
  };

  // Function to remove item from cart
  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    toast.success("Item removed from cart");
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.cartQuantity || 1;
      return total + (item.price * quantity);
    }, 0);
  };

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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item._id}>
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
                              onClick={() => updateQuantity(item._id, -1)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-gray-700">{item.cartQuantity || 1}</span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
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
                            Rs. {((item.cartQuantity || 1) * item.price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeItem(item._id)}
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
                    <button onClick={() => {
                      navigate('/checkout'); // Corrected path to a single slash
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