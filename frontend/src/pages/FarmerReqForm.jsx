import { useState, useEffect } from "react";
import "../styles/farmerReqForm.css";


const FarmerReqForm = () => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedFarmer, setUpdatedFarmer] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/deliveryReq/get-delivery-requests")
      .then((res) => res.json())
      .then((data) => setFarmers(data))
      .catch((err) => console.error("Error fetching farmers:", err));
  }, []);

  const handleUpdateFarmer = (farmer) => {
    if (farmer.status !== 'Pending') {
        alert("Truck driver has accepted the booking. You can't change this now.");
        return;
      }

    setSelectedFarmer(farmer);
    setUpdatedFarmer(farmer);
    setIsUpdateModalOpen(true); // Open modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFarmer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = () => {
    fetch(`http://localhost:3000/api/deliveryReq/update-farmer/${selectedFarmer._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFarmer),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Updated Farmer:", data);
        setIsUpdateModalOpen(false); // Close modal
        window.location.reload();
      })
      .catch((err) => console.error("Error updating farmer:", err));
  };

  const handleDeleteFarmer = (id) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      fetch(`http://localhost:3000/api/deliveryReq/delete-farmer/${id}`, { method: "DELETE" })
        .then((res) => res.json(),
        window.location.reload())
        .then(() => {
          setFarmers((prevFarmers) => prevFarmers.filter((farmer) => farmer._id !== id));
        })
        .catch((err) => console.error("Error deleting farmer:", err));
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'active') return 'status-active';
    if (statusLower === 'inactive') return 'status-inactive';
    if (statusLower === 'pending') return 'status-pending';
    return 'status-default';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Farmers Dashboard</h2>
        
        <div className="dashboard-actions">
         
        </div>
      </div>

      {/* Stats cards */}
      <div className="stats-container">
        <div className="stats-card stats-total">
          <h3 className="stats-label">Total Farmers</h3>
          <p className="stats-value">{farmers.length}</p>
        </div>
        <div className="stats-card stats-active">
          <h3 className="stats-label">Active Farmers</h3>
          <p className="stats-value">{farmers.filter(f => f.status?.toLowerCase() === 'active').length}</p>
        </div>
        <div className="stats-card stats-pending">
          <h3 className="stats-label">Pending Verification</h3>
          <p className="stats-value">{farmers.filter(f => f.status?.toLowerCase() === 'pending').length}</p>
        </div>
        <div className="stats-card stats-districts">
          <h3 className="stats-label">Districts</h3>
          <p className="stats-value">{new Set(farmers.map(f => f.district)).size}</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="farmers-table">
          <thead>
            <tr>
              <th>Farmer ID</th>
              <th>Phone</th>
              <th>District</th>
              <th>Status</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {farmers.length > 0 ? (
              farmers.map((farmer) => (
                <tr key={farmer._id}>
                  <td>
                    <div className="farmer-id-cell">
                      <div className="farmer-avatar">
                        <span className="avatar-text">👨‍🌾</span>
                      </div>
                      <span className="farmer-id">{farmer.farmerId}</span>
                    </div>
                  </td>
                  <td>{farmer.farmerPhone}</td>
                  <td>{farmer.district}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(farmer.status)}`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="action-column">
          <button 
            onClick={() => handleUpdateFarmer(farmer)}
            className="update-button"
          >
            Update
          </button>
          <button 
            onClick={() => handleDeleteFarmer(farmer._id)}
            className="delete-button"
          >
            Delete
          </button>
        </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-table-message">
                  No farmers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">
          Showing <span className="pagination-count">{farmers.length}</span> farmers
        </div>
        <div className="pagination-controls">
          <button className="pagination-button">Previous</button>
          <button className="pagination-button pagination-active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">Next</button>
        </div>
      </div>

      {isUpdateModalOpen && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#1f2937',
        margin: '0 0 24px 0',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb'
      }}>Update Farmer Details</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: '#4b5563',
          marginBottom: '6px'
        }}>Farmer ID:</label>
        <input
          type="text"
          name="farmerId"
          value={updatedFarmer.farmerId}
          onChange={handleChange}
          style={{
            width: '80%',
            padding: '10px 14px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: '#4b5563',
          marginBottom: '6px'
        }}>Phone Number:</label>
        <input
          type="text"
          name="farmerPhone"
          value={updatedFarmer.farmerPhone}
          onChange={handleChange}
          style={{
            width: '80%',
            padding: '10px 14px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: '#4b5563',
          marginBottom: '6px'
        }}>District:</label>
        <input
          type="text"
          name="district"
          value={updatedFarmer.district}
          onChange={handleChange}
          style={{
            width: '80%',
            padding: '10px 14px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}
        />
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '24px'
      }}>
        <button 
          onClick={handleUpdateSubmit} 
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#10b981',
            color: 'white'
          }}
        >
          Update
        </button>
        <button 
          onClick={() => setIsUpdateModalOpen(false)} 
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#ef4444',
            color: 'white'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default FarmerReqForm;