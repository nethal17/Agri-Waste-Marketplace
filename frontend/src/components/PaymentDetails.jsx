import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState(0);

  useEffect(() => {
    // Fetch driver details including deliveryCount
    axios.get(`http://localhost:3000/api/drivers/${id}`)
      .then(response => {
        setDriver(response.data);
        setCompletedDeliveries(response.data.deliveryCount || 0);
      })
      .catch(error => console.error(error));
  }, [id]);

  if (!driver) {
    return <div className="loading">Loading...</div>;
  }

  const basicSalary = 20000.00;
  const deliveryBonus = 500.00;
  const bonusDeliveries = Math.max(0, completedDeliveries - 15); // Only count deliveries above 15
  const totalSalary = basicSalary + (bonusDeliveries * deliveryBonus);

  const handlePay = async () => {
    try {
      const paymentData = {
        driverId: id,
        driverName: driver.name,
        payAmount: totalSalary,
      };

      const response = await axios.post('http://localhost:3000/api/payments', paymentData);
      console.log('Payment inserted:', response.data);

      // Update driver's total salary
      await axios.put(`http://localhost:3000/api/drivers/${id}/salary`, {
        totalSalary: driver.totalSalary + totalSalary
      });

      // Reset delivery count after payment
      await axios.put(`http://localhost:3000/api/drivers/${id}/delivery-count`, {
        deliveryCount: 0
      });

      alert('Payment data inserted successfully!');

      const stripeResponse = await axios.post('http://localhost:3000/api/create-checkout-session', {
        totalSalary,
        driverId: id,
        driverName: driver.name,
      });

      window.location.href = stripeResponse.data.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process payment. Please try again.');
    }
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
          {bonusDeliveries > 0 && (
            <p><strong>Bonus Deliveries (above 15):</strong> {bonusDeliveries} × Rs. 500.00</p>
          )}
          <p><strong>Total Salary:</strong> Rs. {totalSalary.toFixed(2)}</p>
        </div>
        <button className="pay-button" onClick={handlePay}>Pay Now</button>
      </div>
    </div>
  );
};

export default PaymentDetails;