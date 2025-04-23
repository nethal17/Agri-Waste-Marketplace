import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart from localStorage after successful payment
    localStorage.removeItem('cart');
    toast.success('Payment successful!');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 text-center bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 text-green-500">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-gray-800">Payment Successful!</h2>
        <p className="mb-8 text-gray-600">
          Thank you for your purchase. Your order has been successfully processed.
        </p>
        <button
          onClick={() => navigate('/pay-history')}
          className="px-6 py-3 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default Success; 