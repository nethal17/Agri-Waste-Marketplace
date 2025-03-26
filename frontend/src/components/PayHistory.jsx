import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../components/Navbar";

const PayHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stripe-payments');
        console.log('Full API Response:', response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from API');
        }

         
        const excludedNames = [
          'yuwani perera',
          'pasan perera',
          'bobee perera'
        ];

        // Filter out payments with excluded names
        const filteredPayments = response.data.filter(payment => {
          if (!payment.driverName) return true;
          
          const lowerCaseName = payment.driverName.toLowerCase();
          return !excludedNames.some(name => lowerCaseName.includes(name));
        });

        console.log('Filtered Payments:', filteredPayments);
        setPayments(filteredPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading product payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8 text-red-500">
          <p>Error loading payments: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Product Payment Transactions
      </h1>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No payment records found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Buyer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount (Rs.)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr key={payment.id || index} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.driverName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.payAmount ? payment.payAmount.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => navigate('/high-payments')}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Driver Paid Salaries
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Driver List
        </button>
      </div>
    </div>
    </>
  );
};

export default PayHistory;