import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Final = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [highTotalAmount, setHighTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productListingPayments, setProductListingPayments] = useState(0);

  useEffect(() => {
    const fetchAndCalculateTotals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stripe-payments');
        const payments = response.data;

        const total = payments.reduce((sum, payment) => {
          const amount = parseFloat(payment.payAmount) || 0;
          return sum + amount;
        }, 0);

        const highTotal = payments.reduce((sum, payment) => {
          const amount = parseFloat(payment.payAmount) || 0;
          return amount >= 20000 ? sum + amount : sum;
        }, 0);

        // Calculate product listing payments (Rs. 1000.00 each)
        const productListingTotal = payments.reduce((sum, payment) => {
          // Check if this is a product listing payment (Rs. 1000.00)
          if (payment.payAmount === 1000) {
            return sum + 1000;
          }
          return sum;
        }, 0);

        setTotalAmount(total);
        setHighTotalAmount(highTotal);
        setProductListingPayments(productListingTotal);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to fetch payment data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateTotals();
  }, []);

  // Calculate farmer payment (80% of total amount)
  const farmerPayment = totalAmount * 0.8;
  // Calculate profit (20% of total amount)
  const profit = totalAmount * 0.2;

  const pieData = [
    { name: 'Total Earned', value: totalAmount },
    { name: 'Paid to Farmers (80%)', value: farmerPayment },
    { name: 'Profit (20%)', value: profit }
  ];

  const COLORS = ['#4ade80', '#60a5fa', '#facc15'];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Total Payments Summary</h1>

        {loading ? (
          <p className="text-center text-gray-600">Calculating totals...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Side: Summary Boxes */}
              <div className="flex-1 space-y-6">
                <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
                  <p className="text-xl font-semibold text-center">Total Amount of Earn :</p> 
                  <p className="text-3xl mt-2 font-bold text-center">Rs. {totalAmount.toFixed(2)}</p>
                </div>

                <div className="bg-blue-100 border border-blue-400 text-blue-800 px-6 py-4 rounded-lg">
                  <p className="text-xl font-semibold text-center">Total Amount to Pay for Farmers (80%) :</p>
                  <p className="text-3xl mt-2 font-bold text-center">Rs. {farmerPayment.toFixed(2)}</p>
                </div>

                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                  <p className="text-xl font-semibold text-center">Total Profit (20%) :</p>
                  <p className="text-3xl mt-2 font-bold text-center">Rs. {profit.toFixed(2)}</p>
                </div>
              </div>

              {/* Right Side: Pie Chart */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Payment Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* New Section: Product Listing Payments */}
            <div className="mt-10 p-6 bg-purple-50 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Product Listing Payments Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4">Total Product Listing Payments</h3>
                  <p className="text-3xl font-bold text-purple-600">Rs. {productListingPayments.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-2">From {productListingPayments / 1000} product listings</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4">Average Payment per Listing</h3>
                  <p className="text-3xl font-bold text-purple-600">Rs. 1000.00</p>
                  <p className="text-sm text-gray-600 mt-2">Fixed amount per product listing</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Final;
