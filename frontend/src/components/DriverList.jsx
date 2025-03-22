import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DriverList.css';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch drivers from the backend
    axios.get('http://localhost:3000/api/drivers')
      .then(response => {
        console.log('Drivers fetched:', response.data); // Debugging statement
        setDrivers(response.data);
      })
      .catch(error => {
        console.error('Error fetching drivers:', error); // Debugging statement
      });
  }, []);

  const handleCalculatePayment = (driverId) => {
    navigate(`/driver/${driverId}/payment`);
  };

  const handleViewPayHistory = () => {
    navigate('/pay-history'); // Navigate to the Pay History page
  };

  return (
    <div className="driver-list-container">
      <h1>Driver List</h1>
      <button className="pay-history-button" onClick={handleViewPayHistory}>
        View Pay History
      </button>
      <table className="driver-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, index) => (
            <tr key={driver._id}>
              <td>{index + 1}</td> {/* Numbering starts from 1 */}
              <td>{driver.name}</td>
              <td>{driver.age}</td>
              <td>
                <button
                  className="calculate-button"
                  onClick={() => handleCalculatePayment(driver._id)}
                >
                  Calculate Salary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverList;