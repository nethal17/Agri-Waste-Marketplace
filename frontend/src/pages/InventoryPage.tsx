import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { Product } from "../types";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Navbar } from "@/components/Navbar";

const InventoryPage = () => {
  const [approvedProducts, setApprovedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  const fetchApprovedProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/inventory/approved");
      if (!response.ok) {
        throw new Error("Failed to fetch approved products.");
      }
      const data: Product[] = await response.json();
      setApprovedProducts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const categoryCounts = approvedProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;

  return (
    <>

    <Navbar/>

    <Navbar />

    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search inventory..."
          className="border p-3 rounded-lg w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center space-x-4">
          <FiBell className="text-3xl text-gray-600 cursor-pointer hover:text-gray-900 transition" />
          
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        {Object.keys(categoryCounts).map((category) => (
          <div key={category} className="p-6 border rounded-lg shadow-md bg-white text-center hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700">{category}</h3>
            <p className="text-3xl font-bold text-blue-500">{categoryCounts[category]}</p>
          </div>
        ))}
      </div>

      {/* Inventory Table & Chart Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Inventory Items</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-auto h-96">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-gray-200">
                  <th className="p-3 text-gray-700">Product</th>
                  <th className="p-3 text-gray-700">Description</th>
                  <th className="p-3 text-gray-700">Price</th>
                  <th className="p-3 text-gray-700">Quantity</th>
                  <th className="p-3 text-gray-700">Expire Date</th>
                </tr>
              </thead>
              <tbody>
                {approvedProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">{product.productName}</td>
                    <td className="p-3">{product.description}</td>
                    <td className="p-3 font-semibold text-green-600">${product.price}</td>
                    <td className="p-3">{product.quantity}</td>
                    <td className="p-3">{new Date(product.expireDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
    </>
  );
};

export default InventoryPage;
