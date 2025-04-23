import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from "../components/Navbar";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/searchUser/${id}`);
        setDriver(response.data);
        // Set a default value for completed deliveries if not available
        setCompletedDeliveries(response.data.deliveryCount || 0);
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setError('Failed to load driver information');
      }
    };

    fetchDriverData();
  }, [id]);

  const basicSalary = 20000.00;
  const deliveryBonus = 500.00;
  const bonusDeliveries = Math.max(0, completedDeliveries - 15);
  const totalSalary = basicSalary + (bonusDeliveries * deliveryBonus);

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Sending payment request with:', {
        totalSalary,
        driverId: id,
        driverName: driver.name
      });
      
      // Use the new driver payment endpoint
      const response = await axios.post('http://localhost:3000/api/driver-payment', {
        totalSalary,
        driverId: id,
        driverName: driver.name
      });
      
      console.log('Payment response:', response.data);
      
      if (response.data.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('Invalid response from payment server');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!driver) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Salary Payment 
          </h1><br></br>
          <p className="mt-3 text-xl text-gray-600">
            Process payment for {driver.name}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Driver Information</h2>
          </div>

          {/* Driver Info */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  className="h-16 w-16 rounded-full object-cover" 
                  src={driver.profilePic || 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'} 
                  alt={driver.name}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{driver.name}</h3>
                <p className="text-sm text-gray-500">Driver ID: {id.substring(0, 8)}</p>
                <p className="text-sm text-gray-500">Email: {driver.email}</p>
                <p className="text-sm text-gray-500">Phone: {driver.phone}</p>
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Salary:</span>
                <span className="font-medium">Rs. {basicSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Deliveries:</span>
                <span className="font-medium">{completedDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus Deliveries:</span>
                <span className="font-medium">{bonusDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Bonus:</span>
                <span className="font-medium">Rs. {(bonusDeliveries * deliveryBonus).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total Salary:</span>
                <span className="text-lg font-bold text-green-600">Rs. {totalSalary.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Payment Button */}
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-md text-white font-medium shadow-sm ${isProcessing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Proceed to Payment'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/driver')}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            ← Back to driver list
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PaymentDetails;