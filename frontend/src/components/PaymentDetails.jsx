import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PaymentDetails.css'; // Ensure this CSS file exists

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);

  useEffect(() => {
    // Fetch driver details
    axios.get(`http://localhost:3000/api/drivers/${id}`)
      .then(response => setDriver(response.data))
      .catch(error => console.error(error));

    // Fetch completed delivery count
    axios.get(`http://localhost:3000/api/drivers/${id}/deliveries`)
      .then(response => setCompletedDeliveries(response.data.count))
      .catch(error => console.error(error));
  }, [id]);

  if (!driver) {
    return <div className="loading">Loading...</div>;
  }

  const basicSalary = 20000.00;
  const deliveryBonus = 500.00;
  const totalSalary = basicSalary + (completedDeliveries * deliveryBonus);

  const handlePay = () => {
    navigate('/payment', { state: { totalSalary } });
  };

  return (
    <div className="payment-details-container">
      <h1>Pay Salary</h1>
      <div className="payment-card">
        <div className="driver-info">
          <h2>Driver Details</h2>
          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Age:</strong> {driver.age}</p>
        </div>
        <div className="salary-info">
          <h2>Salary Details</h2>
          <p><strong>Basic Salary:</strong> Rs. {basicSalary.toFixed(2)}</p>
          <p><strong>Completed Delivery Count:</strong> {completedDeliveries}</p>
          <p><strong>Total Salary:</strong> Rs. {totalSalary.toFixed(2)}</p>
        </div>
        <button className="pay-button" onClick={handlePay}>Pay Now</button>
      </div>
    </div>
  );
};

export default PaymentDetails;