import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { Navbar } from '../components/Navbar';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData._id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found, please login again.');
          setError('Authentication error. Please login again.');
          return;
        }
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

  const handlePreviewClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleAddReview = () => {
    if (selectedOrder) {
      navigate('/add-review', {
        state: { productId: selectedOrder.productId._id, buyerId: userId },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={40} />
        <p className="ml-3 text-gray-600 text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Order History</h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-blue-500 text-white">
              <tr>
                {['Product', 'Quantity', 'Total Price', 'Order Date', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-4 font-medium uppercase">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{order.productId.name}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handlePreviewClick(order)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
              <h3 className="text-2xl font-bold mb-4">Order Details</h3>
              <div className="space-y-3">
                <p><span className="font-semibold">Product:</span> {selectedOrder.productId.name}</p>
                <p><span className="font-semibold">Quantity:</span> {selectedOrder.quantity}</p>
                <p><span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice.toFixed(2)}</p>
                <p><span className="font-semibold">Order Date:</span> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                  Close
                </button>
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Add Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};