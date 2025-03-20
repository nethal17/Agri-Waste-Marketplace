import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner'; // Toast notifications
import { useNavigate } from 'react-router-dom'; // For navigation
import { Order } from '../types';
import { OrderHistoryProps } from '../types';
import { ClipLoader } from 'react-spinners'; // Import the ClipLoader spinner

const OrderHistory: React.FC<OrderHistoryProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For popup details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // For popup visibility
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found, please login again.');
          setError('Authentication error. Please login again.');
          return;
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userData._id;
        const response = await axios.get(`http://localhost:3000/api/orders/userOrder/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Open modal with order details
  const handleReviewClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Navigate to AddReviewPage
  const handleAddReview = () => {
    if (selectedOrder) {
      navigate(`/addreview`, { state: { productId: selectedOrder.productId, buyerId: userId } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#3B82F6" size={35} /> {/* Blue spinner, size 35px */}
        <p className="ml-2 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Order History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{order.productId.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleReviewClick(order)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Order Details</h3>
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Product:</span> {selectedOrder.productId.name}
              </p>
              <p>
                <span className="font-semibold">Quantity:</span> {selectedOrder.quantity}
              </p>
              <p>
                <span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice.toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Order Date:</span>{' '}
                {new Date(selectedOrder.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleAddReview}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;