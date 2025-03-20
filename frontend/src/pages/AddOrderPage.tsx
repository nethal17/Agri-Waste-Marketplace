import React, { useState } from 'react';
import axios from 'axios';

const AddOrderForm: React.FC = () => {
  const [buyerId, setBuyerId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/orders/add', {
        buyerId,
        productId,
        quantity,
        totalPrice,
      });
      setMessage('Order created successfully.');
      console.log('Order created:', response.data.order);
    } catch (error) {
      setMessage('Error creating order.');
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h2>Add Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Buyer ID:</label>
          <input
            type="text"
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product ID:</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Total Price:</label>
          <input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Add Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddOrderForm;