import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/drivers/${id}`)
      .then(response => {
        setDriver(response.data);
        setCompletedDeliveries(response.data.deliveryCount || 0);
      })
      .catch(error => console.error(error));
  }, [id]);

  const basicSalary = 20000.00;
  const deliveryBonus = 500.00;
  const bonusDeliveries = Math.max(0, completedDeliveries - 15);
  const totalSalary = basicSalary + (bonusDeliveries * deliveryBonus);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const paymentData = {
        driverId: id,
        driverName: driver.name,
        payAmount: totalSalary,
      };

      const response = await axios.post('http://localhost:3000/api/payments', paymentData);
      console.log('Payment inserted:', response.data);

      await axios.put(`http://localhost:3000/api/drivers/${id}/salary`, {
        totalSalary: driver.totalSalary + totalSalary
      });

      await axios.put(`http://localhost:3000/api/drivers/${id}/delivery-count`, {
        deliveryCount: 0
      });

      const stripeResponse = await axios.post('http://localhost:3000/api/create-checkout-session', {
        totalSalary,
        driverId: id,
        driverName: driver.name,
      });

      window.location.href = stripeResponse.data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process payment. Please try again.');
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
                <p className="text-sm text-gray-500">Age: {driver.age}</p>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Breakdown</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700">Basic Salary:</span>
                <span className="font-medium">Rs. {basicSalary.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700">Completed Deliveries:</span>
                <span className="font-medium">{completedDeliveries}</span>
              </div>
              
              {bonusDeliveries > 0 && (
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Bonus Deliveries (above 15):</span>
                  <span className="font-medium">
                    {bonusDeliveries} × Rs. {deliveryBonus.toFixed(2)} = Rs. {(bonusDeliveries * deliveryBonus).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-t-2 border-green-200 mt-6">
                <span className="text-gray-700 font-semibold">Total Salary:</span>
                <span className="text-xl font-bold text-green-600">Rs. {totalSalary.toFixed(2)}</span>
              </div>
            </div>
          </div>

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
            onClick={() => navigate(-1)}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            ← Back to driver list
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;