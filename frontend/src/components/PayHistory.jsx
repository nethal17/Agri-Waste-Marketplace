import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayHistory = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stripe-payments');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching Stripe payments:', error);
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
        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6">
            <table className="min-w-full">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Driver Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Pay Amount (Rs.)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.driverName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.payAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => navigate('/high-payments')}
        >
          Paid Driver Sallary
        </button>
        <button
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => navigate('/')}
        >
          Back to Driver List
        </button>
      </div>
    </div>
  );
};

export default PayHistory;