import React, { useState } from "react";
import axios from "axios";

const agreementText = `
By submitting this registration form, I hereby confirm that all information provided is true and accurate to the best of my knowledge. I acknowledge that I possess a valid driving license appropriate for the vehicle I operate, and I am responsible for maintaining its validity at all times. I agree to comply with all applicable traffic laws, transportation regulations, and safety standards while carrying out deliveries. I understand that it is my responsibility to ensure my vehicle is properly maintained and roadworthy. I commit to completing deliveries promptly and professionally, and to immediately communicate any delays or issues to the relevant parties. I further agree to conduct myself respectfully towards customers, farmers, and company representatives, and to use the company's logistics systems responsibly and securely. I understand that all delivery-related information must be treated as confidential. I acknowledge that I am responsible for maintaining appropriate insurance coverage for my vehicle and my activities. I accept that [Your Company Name] reserves the right to suspend or terminate my registration in the event of non-compliance with these terms or failure to fulfill my duties satisfactorily. By proceeding, I affirm my agreement to abide by these terms and conditions.
`;

const vehicleTypes = [
  "Lorry",
  "Truck",
  "Mini Truck",
];

const districts = [
  "Colombo",
  "Gampaha",
  "Kandy",
];

const VehicleReg = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    nic: "",
    licenseNumber: "",
    licenseExpiry: "",
    address: "",
    preferredDistrict: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseCopy: null,
    agreement: false,
  });
  const [showAgreement, setShowAgreement] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.agreement) {
      setError("You must agree to the terms.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "licenseCopy" && value) {
          data.append(key, value);
        } else if (key !== "licenseCopy") {
          data.append(key, value);
        }
      });

      await axios.post("/api/truck-drivers/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Registration successful! Please check your email.");
      setForm({
        nic: "",
        licenseNumber: "",
        licenseExpiry: "",
        address: "",
        preferredDistrict: "",
        vehicleType: "",
        vehicleNumber: "",
        licenseCopy: null,
        agreement: false,
      });
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Registration failed. Please check your details and try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Vehicle Registration
        </h2>
        {message && <div className="mb-4 text-green-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        
    
      
        <div className="mb-4">
          <input
            name="nic"
            value={form.nic}
            onChange={handleChange}
            required
            placeholder="NIC Number"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            required
            placeholder="License Number"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            name="licenseExpiry"
            type="date"
            value={form.licenseExpiry}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Address"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <select
            name="preferredDistrict"
            value={form.preferredDistrict}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Preferred District/Area</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <select
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <input
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            required
            placeholder="Vehicle Number Plate"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label>
            Upload License Copy (optional):
            <input
              type="file"
              name="licenseCopy"
              onChange={handleChange}
              className="block mt-2"
            />
          </label>
        </div>
        <div className="mb-4">
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => setShowAgreement(true)}
          >
            Read Driver Agreement
          </button>
          {showAgreement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                <h3 className="text-lg font-bold mb-2">Driver Agreement</h3>
                <div
                  className="mb-4"
                  style={{ maxHeight: "300px", overflowY: "auto", whiteSpace: "pre-wrap" }}
                >
                  {agreementText}
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => setShowAgreement(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="agreement"
            checked={form.agreement}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <span>I have read and agree to the Driver Agreement</span>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default VehicleReg; 