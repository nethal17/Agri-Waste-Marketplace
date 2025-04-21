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

        setTotalAmount(total);
        setHighTotalAmount(highTotal);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to fetch payment data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateTotals();
  }, []);

  const profit = totalAmount - highTotalAmount;

  const pieData = [
    { name: 'Total Earned', value: totalAmount },
    { name: 'Paid to Drivers', value: highTotalAmount },
    { name: 'Profit', value: profit }
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
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Side: Summary Boxes */}
            <div className="flex-1 space-y-6">
              <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
                <p className="text-xl font-semibold text-center">Total Amount of Earn :</p> 
                <p className="text-3xl mt-2 font-bold text-center">Rs. {totalAmount.toFixed(2)}</p>
              </div>

              <div className="bg-blue-100 border border-blue-400 text-blue-800 px-6 py-4 rounded-lg">
                <p className="text-xl font-semibold text-center">Total Amount Paid for Drivers :</p>
                <p className="text-3xl mt-2 font-bold text-center">Rs. {highTotalAmount.toFixed(2)}</p>
              </div>

              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                <p className="text-xl font-semibold text-center">Total Profit :</p>
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
        )}
      </div>
    </>
  );
};

export default Final;
