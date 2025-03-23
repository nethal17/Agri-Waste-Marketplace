import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayHistory = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch payment history from the backend
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/payments');
        console.log('Payments fetched:', response.data); // Debugging statement
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error); // Debugging statement
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Payment History
      </h1>

      {payments.length === 0 ? (
        <p className="text-center text-gray-600">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Driver Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Pay Amount (Rs.)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.driverName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.payAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors block mx-auto"
        onClick={() => navigate('/')}
      >
        Back to Driver List
      </button>
    </div>
  );
};

export default PayHistory;