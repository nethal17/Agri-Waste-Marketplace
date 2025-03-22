import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PayHistory.css'; // Ensure this CSS file exists

const PayHistory = () => {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch payment history from the backend
    axios.get('http://localhost:3000/api/payments')
      .then(response => {
        console.log('Payments fetched:', response.data); // Debugging statement
        setPayments(response.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error); // Debugging statement
      });
  }, []);

  return (
    <div className="pay-history-container">
      <h1>Pay History</h1>
      <table className="pay-history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Driver Name</th>
            <th>Pay Amount (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td> {/* Numbering starts from 1 */}
              <td>{payment.driverName}</td>
              <td>{payment.payAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Driver List
      </button>
    </div>
  );
};

export default PayHistory;