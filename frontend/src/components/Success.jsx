import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>Thank you for completing the payment.</p>
      <button onClick={() => navigate('/driver')}>Back to Home</button>
    </div>
  );
};

export default Success;