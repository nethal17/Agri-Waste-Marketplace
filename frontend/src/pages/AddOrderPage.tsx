import React, { useState } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';

const AddOrderForm: React.FC = () => {
  const [buyerId, setBuyerId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/orders/add', {
        buyerId,
        productId,
        quantity,
        totalPrice,
      });
      setMessage('✅ Order created successfully.');
      console.log('Order created:', response.data.order);
    } catch (error) {
      setMessage('❌ Error creating order. Please try again.');
      console.error('Error creating order:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🛒 Add Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buyer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Buyer ID:</label>
            <input
              type="text"
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Buyer ID"
            />
          </div>

          {/* Product ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product ID:</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Product ID"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              min="1"
              placeholder="Enter Quantity"
            />
          </div>

          {/* Total Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Price:</label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              placeholder="Enter Total Price"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ✅ Add Order
            </button>
          </div>
        </form>

        {/* Message Display */}
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
        )}
      </div>
    </>
  );
};

export default AddOrderForm;
