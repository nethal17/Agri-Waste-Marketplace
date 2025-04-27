import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

export const OrderHistoryPage = ({ checkoutData }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData._id;

  useEffect(() => {
    fetchOrders();
  }, userId, []);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/order-history/user/${userId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to fetch order history", error);
    }
  };

  // Insert Order into History (when clicking Proceed to Payment)
  const handleProceedToPayment = async () => {
    try {
      await axios.post("/api/order-history", {
        userId: userId,
        productName: checkoutData.productName,
        quantity: checkoutData.quantity,
        totalPrice: checkoutData.totalPrice,
      });
      alert("Order saved to history successfully!");
      fetchOrders(); // Refresh after saving
    } catch (error) {
      console.error("Failed to save order history", error);
      alert("Failed to save order history");
    }
  };

  // Filter by Date Range
  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    setFilteredOrders(filtered);
  };

  // Cancel Order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.delete(`http://localhost:3000/api/order-history/cancel/${orderId}`);
        fetchOrders();
      } catch (error) {
        console.error("Failed to cancel order", error);
      }
    }
  };

  console.log("User ID:", userId);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">Order History</h1>

      {/* Proceed to Payment Button */}
      {/* 🛠 Only show if checkoutData exists */}
      {checkoutData && (
        <div className="mb-6">
          <button
            onClick={handleProceedToPayment}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {/* Total Orders */}
      <p className="mb-6 text-gray-600">
        Total Orders: {Array.isArray(filteredOrders) ? filteredOrders.length : 0}
      </p>

      {/* Date Filter */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(filteredOrders) && filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              Array.isArray(filteredOrders) &&
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(order.orderDate), "dd MMM yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                    >
                      Cancel Order
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
