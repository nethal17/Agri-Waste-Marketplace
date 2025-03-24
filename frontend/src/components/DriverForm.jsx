import React, { useState } from 'react';
import axios from 'axios';

const DriverForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [deliveryCount, setDeliveryCount] = useState(0); // Add this state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/drivers', { 
        name, 
        age,
        deliveryCount // Include delivery count
      });
      alert('Driver created successfully!');
      setName('');
      setAge('');
      setDeliveryCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Driver</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Delivery Count:</label>
          <input
            type="number"
            value={deliveryCount}
            onChange={(e) => setDeliveryCount(parseInt(e.target.value) || 0)}
            min="0"
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default DriverForm;