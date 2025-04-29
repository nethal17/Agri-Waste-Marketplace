import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FiShoppingBag, FiCalendar, FiFilter, FiX, FiCheck, FiTruck, FiStar } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Navbar } from "../components/Navbar";
import { Modal, Input, message } from "antd";

const ReviewModal = ({ isOpen, onClose, order, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        productName: order.productName,
        orderId: order._id,
        rating,
        review: reviewText
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Review Product</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-medium mb-2">{order.productName}</p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-2xl mr-1 focus:outline-none"
              >
                {star <= rating ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Share your experience with this product..."
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const OrderHistoryPage = ({ checkoutData }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const statusOptions = [
    { value: "all", label: "All Orders", icon: <FiShoppingBag /> },
    { value: "toDeliver", label: "To Deliver", icon: <FiTruck /> },
    { value: "toReceive", label: "To Receive", icon: <FiCheck /> },
    { value: "toReview", label: "To Review", icon: <FiStar /> },
  ];

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/order-history/user/${userId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      filterOrders(data, activeStatus, startDate, endDate);
    } catch (error) {
      console.error("Failed to fetch order history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = (ordersToFilter, status, start, end) => {
    let filtered = [...ordersToFilter];
    
    if (status !== "all") {
      filtered = filtered.filter(order => order.orderStatus === status);
    }
    
    if (start && end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= new Date(start) && orderDate <= new Date(end);
      });
    }
    
    setFilteredOrders(filtered);
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    filterOrders(orders, status, startDate, endDate);
  };

  const handleDateFilter = () => {
    filterOrders(orders, activeStatus, startDate, endDate);
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveStatus("all");
    setFilteredOrders(orders);
  };

  const handleProceedToPayment = async () => {
    try {
      await axios.post("/api/order-history", {
        userId: userId,
        productName: checkoutData.productName,
        productId: checkoutData.productId,
        quantity: checkoutData.quantity,
        totalPrice: checkoutData.totalPrice,
      });
      alert("Order saved to history successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Failed to save order history", error);
      alert("Failed to save order history");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      toDeliver: "bg-blue-100 text-blue-800",
      toReceive: "bg-purple-100 text-purple-800",
      toReview: "bg-amber-100 text-amber-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800"
    };
    
    const statusText = {
      toDeliver: "To Deliver",
      toReceive: "To Receive",
      toReview: "To Review",
      cancelled: "Cancelled",
      completed: "Completed"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
        {statusText[status] || status}
      </span>
    );
  };

  const handleCancelOrder = async (orderId) => {
    try {
      // Get the order details first
      const order = orders.find(o => o._id === orderId);
      if (!order) {
        message.error('Order not found');
        return;
      }

      // Format the data for refund
      const refundData = {
        userId: order.userId, // Directly use userId as it's already the ID
        productName: order.productName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        orderDate: order.orderDate,
        //refundDate: new Date().toISOString(),
        refundReason: "Order cancelled by user",
        refundStatus: "pending"
      };

      console.log('Sending refund data:', refundData); // Debug log

      // Create refund record first
      const refundResponse = await axios.post('http://localhost:3000/api/refunds/add', refundData);

      if (refundResponse.data) {
        // Then delete the order using the correct endpoint
        await axios.delete(`http://localhost:3000/api/order-history/cancel/${orderId}`);
        
        message.success('Order cancelled and refund created successfully');
        fetchOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      console.error('Error response:', error.response?.data); // Debug log
      message.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/reviews/add", {
        
        buyerId: userId,
        orderId: reviewData.orderId,
        productName: reviewData.productName,
        rating: reviewData.rating,
        review: reviewData.review
      });
      
      fetchOrders();
      
      /*if (response.status === 201) {
        // Update order status to completed
        await axios.patch(`http://localhost:3000/api/order-history/${reviewData.orderId}`, {
          orderStatus: "completed"
        });
        
        
        
      }*/
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  return (
    <>
          <Navbar />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all your past and current orders
            </p>
          </div>
          
          {checkoutData && (
            <button
              onClick={handleProceedToPayment}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Proceed to Payment
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusFilter(option.value)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${activeStatus === option.value ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date Range</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDateFilter}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiFilter className="mr-2" />
                    Apply
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiX className="mr-2" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FiShoppingBag className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiTruck className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">To Deliver</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.orderStatus === 'toDeliver').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiCheck className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">To Receive</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.orderStatus === 'toReceive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <FiStar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">To Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.orderStatus === 'toReview').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeStatus === "all" 
                  ? "You haven't placed any orders yet."
                  : `You don't have any orders with status "${activeStatus}".`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                            <FiShoppingBag className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Rs. {order.totalPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(new Date(order.orderDate), "MMM dd, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.orderStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Cancel
                          </button>
                        )}
                        {order.orderStatus === 'toReview' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsReviewModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={selectedOrder}
        onSubmit={handleReviewSubmit}
      />
    </div>
    </>
  );
};