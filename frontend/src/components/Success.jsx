import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircleIcon className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-green-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for completing the payment. Your transaction has been processed successfully.
          
        </p>
        
        <button
          onClick={() => navigate('/driver')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Back to Home
        </button>
        
       
      </div>
    </div>
  );
};

export default Success;