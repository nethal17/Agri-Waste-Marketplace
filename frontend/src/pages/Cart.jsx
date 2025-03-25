import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const [cart, setCart] = useState([]); // Store cart data from localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []; // Get data from localStorage
    setCart(storedCart);
  }, []);

  // Function to increase or decrease quantity
  const updateQuantity = (wasteId, change) => {
    const updatedCart = cart.map(item => {
      if (item._id === wasteId) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // Prevent negative quantity
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  // Function to remove item from cart
  const removeItem = (wasteId) => {
    const updatedCart = cart.filter(item => item._id !== wasteId); // Remove item from cart
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-red-500">My Cart</h2>
      {cart.length > 0 ? (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-red-100">
              <th className="p-2">Waste Type</th>
              <th>District</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id} className="border-b">
                <td>{item.waste_type}</td>
                <td>{item.district}</td>
                <td>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-300 px-2 py-1"
                      onClick={() => updateQuantity(item._id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="bg-gray-300 px-2 py-1"
                      onClick={() => updateQuantity(item._id, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>Rs. {item.price * item.quantity}</td>
                <td>
                  <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => removeItem(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
      )}
      <div className="flex justify-between mt-4">
        <button className="bg-green-700 text-white px-4 py-2" onClick={() => navigate("/organic-waste")}>
          Continue Shopping
        </button>
        <button className="bg-green-700 text-white px-4 py-2" onClick={() => navigate("/buyer-address-form")}>
          Add Address
        </button>
      </div>
    </div>
  );
};
