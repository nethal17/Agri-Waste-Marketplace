import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StripePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalSalary } = location.state || { totalSalary: 0 };

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/create-checkout-session', {
          totalSalary,
        });

        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } catch (error) {
        console.error('Error creating Stripe session:', error);
        navigate('/'); 
      }
    };

    createCheckoutSession();
  }, [totalSalary, navigate]);

  return (
    <div className="stripe-payment-container">
      <h1>Redirecting to Stripe Payment Gateway...</h1>
    </div>
  );
};

export default StripePayment;