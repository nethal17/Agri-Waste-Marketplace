// src/components/InventoryPage.tsx
import { useState, useEffect } from "react";
import { Product } from "../types";

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
      if (error instanceof Error) {
        setError(error.message); // Safely access the message property
      } else {
        setError("An unknown error occurred."); // Handle non-Error types
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="space-y-4">
        {approvedProducts.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">{product.productName}</h2>
            <p className="text-gray-600">{product.description}</p> {/* Display description */}
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Expire Date: {new Date(product.expireDate).toLocaleDateString()}</p>
            <p>Farmer: {product.farmerId?.email}</p>
            {product.photo && (
              <img
                src={product.photo}
                alt={product.productName}
                className="w-32 h-32 object-cover mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;