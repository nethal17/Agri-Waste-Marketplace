import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const districts = [
  { value: "Colombo", label: "Colombo" },
  { value: "Gampaha", label: "Gampaha" },
  { value: "Kandy", label: "Kandy" },
  { value: "Matara", label: "Matara" },
  { value: "Jaffna", label: "Jaffna" },
  { value: "Galle", label: "Galle" },
  { value: "Nuwara Eliya", label: "Nuwara Eliya" },
  { value: "Ratnapura", label: "Ratnapura" },
  { value: "Kegalle", label: "Kegalle" },
  { value: "Badulla", label: "Badulla" },
  { value: "Anuradhapura", label: "Anuradhapura" },
  { value: "Polonnaruwa", label: "Polonnaruwa" },
  { value: "Hambantota", label: "Hambantota" },
  { value: "Kurunegala", label: "Kurunegala" },
  { value: "Monaragala", label: "Monaragala" },
  { value: "Puttalam", label: "Puttalam" },
  { value: "Batticaloa", label: "Batticaloa" },
  { value: "Trincomalee", label: "Trincomalee" },
  { value: "Mannar", label: "Mannar" },
  { value: "Mullaitivu", label: "Mullaitivu" },
  { value: "Kilinochchi", label: "Kilinochchi" },
  { value: "Vavuniya", label: "Vavuniya" },
  { value: "Ampara", label: "Ampara" },
  { value: "Matale", label: "Matale" },
];

export const Checkout = () => {
  const [district, setDistrict] = useState(null);
  const [city, setCity] = useState("");
  const [streetNo, setStreetNo] = useState("");
  const [bill, setBill] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/checkout/bill/67d2becda558ba794d1bfc42").then((res) => {
      setBill(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/checkout/add", {
      userId: "67d2becda558ba794d1bfc42",
      district: district?.value,
      city,
      streetNo,
    });

    if (response.status === 201) {
      alert("Checkout details saved!");
      navigate("/payment");
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <h1 className="text-red-600 text-2xl font-bold mb-5">Check Out</h1>

      {/* Shipping Address Section */}
      <div className="w-3/4 bg-red-50 p-4 rounded-lg shadow-sm mb-5">
        <h2 className="font-bold text-lg">Shipping Address</h2>
      </div>

      {/* Cart Items Table */}
      <div className="w-3/4 bg-red-50 p-4 rounded-lg shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-md font-bold">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Delivery Price</th>
            </tr>
          </thead>
          <tbody>
           
              <tr className="border-t">
                <td className="p-2">name</td>
                <td className="p-2">price</td>
                <td className="p-2">delivery fee</td>
              </tr>
        
          </tbody>
        </table>
      </div>

      {/* Total Price Section */}
      <div className="w-3/4 bg-red-50 p-4 rounded-lg shadow-sm mt-5 text-right">
        <h2 className="font-bold text-lg">
          Total Price : Rs. 1000.00        
          </h2>
      </div>
    </div>
  );
};

export default Checkout;
