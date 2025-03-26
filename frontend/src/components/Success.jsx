import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-green-800">Payment Successful!</h1>
        <p className="mb-8 text-gray-600">
          Thank you for completing the payment. Your transaction has been processed successfully.
          
        </p>
        
        <button
          onClick={() => navigate('/driver')}
          className="w-full px-4 py-3 font-medium text-white transition duration-300 ease-in-out transform bg-green-600 rounded-lg hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Back to Home
        </button>
        
       
      </div>
    </div>
  );
};

export default Success;