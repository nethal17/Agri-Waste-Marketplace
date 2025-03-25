import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const TruckDriverDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState(null);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);

    if (request?.location?.coordinates?.length === 2) {
      setLocation({
        lat: request.location.coordinates[0], 
        lng: request.location.coordinates[1],
      });
    }

    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setLocation(null);
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/deliveryReq/get-delivery-requests")
      .then((res) => res.json())
      .then((data) => {
        setPendingRequests(data.filter((req) => req.status === "Pending"));
        setAcceptedRequests(data.filter((req) => req.status === "accepted"));
        setCompletedDeliveries(
          data.filter((req) => req.status === "completed")
        );
      })
      .catch((err) => console.error("Error fetching requests:", err));
  }, []);

  const handleAccept = (id) => {
    fetch(`http://localhost:3000/api/deliveryReq/update-delivery-requests/${id}`, {
      method: "PUT",
    }).then(() => {
      setPendingRequests((prev) => prev.filter((req) => req._id !== id));
      setAcceptedRequests((prev) => [...prev, { _id: id, status: "accepted" }]);
      window.location.reload()
    });
  };

  const handleCompleted = (id) => {
    fetch(`http://localhost:3000/api/deliveryReq/update-delivery-requests/${id}`, {
      method: "PUT",
    }).then(() => {
      setPendingRequests((prev) => prev.filter((req) => req._id !== id));
      setCompletedDeliveries((prev) => [
        ...prev,
        { _id: id, status: "completed" },
      ]);
      window.location.reload()
    });
  };

  // const handleComplete = (id) => {
  //   fetch(`http://localhost:5000/api/delivery-requests/${id}`, { method: "PUT" })
  //     .then(() => {
  //       setAcceptedRequests(prev => prev.filter(req => req._id !== id));
  //     });
  // };

  return (
    <div className="dashboard-container">
      <h2>Truck Driver Dashboard</h2>
      <div className="requests-section">
        <div className="pending">
          <h3>Pending Requests</h3>
          {pendingRequests.map((req) => (
            <div key={req._id}>
              <p>Farmer ID: {req.farmerId}</p>
              <p>District: {req.district}</p>
              <p>Waste Type: {req.wasteType}</p>
              <div className="buttons">
                <button
                  style={{ backgroundColor: "blue" }}
                  onClick={() => handleViewDetails(req)}
                >
                  View Details
                </button>
                <button onClick={() => handleAccept(req._id)}>Accept</button>
              </div>
            </div>
          ))}
        </div>
        <div className="accepted">
          <h3>Accepted Deliveries</h3>
          {acceptedRequests.map((req) => (
            <div key={req._id}>
              <p>Farmer ID: {req.farmerId}</p>
              <p>District: {req.district}</p>
              <p>Waste Type: {req.wasteType}</p>
              <button onClick={() => handleCompleted(req._id)}>
                Mark as Done
              </button>
            </div>
          ))}
        </div>
        <div className="completed">
          <h3>Completed Deliveries</h3>
          {completedDeliveries.map((req) => (
            <div key={req._id}>
              <p>Farmer ID: {req.farmerId}</p>
              <p>District: {req.district}</p>
              <p>Waste Type: {req.wasteType}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request Details</h3>
            <p>
              <strong>Farmer ID:</strong> {selectedRequest.farmerId}
            </p>
            <p>
              <strong>District:</strong> {selectedRequest.district}
            </p>
            <p>
              <strong>Waste Type:</strong> {selectedRequest.wasteType}
            </p>
            <p>
              <strong>Pickup Date:</strong>{" "}
              {new Date(selectedRequest.pickupDate).toDateString()}
            </p>
            <p>
              <strong>Emergency Contact:</strong>{" "}
              {selectedRequest.emergencyContact}
            </p>
            <p>
              <strong>Location:</strong>
            </p>

            <LoadScript googleMapsApiKey="AIzaSyBvdWTRDRIKWd11ClIGYQrSfc883IEkRiw">
              <GoogleMap
                id="map"
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={location}
                zoom={12}
              >
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
            <button
              style={{ backgroundColor: "red", marginTop: "15px" }}
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruckDriverDashboard;
