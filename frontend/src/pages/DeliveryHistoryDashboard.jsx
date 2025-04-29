import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DeliveryHistoryDashboard.css";

const DeliveryHistoryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/api/order-history/user/${userId}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching order history:", err));
    }
  }, [userId]);

  return (
    <div className="dashboard-container">
      <h2>Delivery History Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No delivery history found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  {/* You can add Accept/Decline buttons here if needed */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryHistoryDashboard;