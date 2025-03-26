import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HighPayments = () => {
  const [highPayments, setHighPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHighPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stripe-payments');
        const filteredPayments = response.data.filter(payment => payment.payAmount >= 20000);
        setHighPayments(filteredPayments);
        
        const total = filteredPayments.reduce((sum, payment) => sum + payment.payAmount, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching high payments:', error);
      }
    };

    fetchHighPayments();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: highPayments.map(payment => payment.driverName),
    datasets: [
      {
        label: 'Payment Amount (Rs.)',
        data: highPayments.map(payment => payment.payAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'High Value Payments Distribution',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (Rs.)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Driver Name'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Paid Driver Sallary
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total High Payments</p>
                <p className="text-2xl font-bold text-black-600">Rs. {totalAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Number of Transactions</p>
                <p className="text-2xl font-bold text-black-600">{highPayments.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Payment</p>
                <p className="text-2xl font-bold text-black-600">
                  Rs. {highPayments.length > 0 ? (totalAmount / highPayments.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-6xl mx-auto mt-8">
        {highPayments.length === 0 ? (
          <p className="text-center text-gray-600">No high value payments found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6">
            <table className="min-w-full">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Driver Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Pay Amount (Rs.)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {highPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.driverName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {payment.payAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => navigate('/pay-history')}
        >
          View Product Payments
        </button>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => navigate('/')}
        >
          Back to Driver List
        </button>
      </div>
    </div>
  );
};

export default HighPayments;