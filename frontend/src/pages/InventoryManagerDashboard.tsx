import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Product } from "../types";

const ManagerDashboard = () => {
  const [pendingListings, setPendingListings] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/inventory/pending");
      if (!response.ok) {
        throw new Error("Failed to fetch pending listings.");
      }
      const data: Product[] = await response.json();
      setPendingListings(data);
    } catch (error) {
      toast.error("Failed to fetch pending listings.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/inventory/approve/${id}`, {
        method: "PUT",
      });
      if (response.ok) {
        toast.success("Product approved!");
        fetchPendingListings(); // Refresh the list
      } else {
        toast.error("Approval failed.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/inventory/delete/${productToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });
      if (response.ok) {
        toast.success("Product deleted!");
        setShowDeleteModal(false);
        fetchPendingListings(); // Refresh the list
      } else {
        toast.error("Deletion failed.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Listings</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Product Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingListings.map((listing) => (
            <tr key={listing._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{listing.productName}</td>
              <td className="py-2 px-4 border">{listing.description}</td>
              <td className="py-2 px-4 border">${listing.price}</td>
              <td className="py-2 px-4 border">{listing.quantity}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => setSelectedProduct(listing)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleApprove(listing._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setProductToDelete(listing._id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Preview Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{selectedProduct.productName}</h2>
            <p className="text-gray-600">{selectedProduct.description}</p>
            <p>Price: ${selectedProduct.price}</p>
            <p>Quantity: {selectedProduct.quantity}</p>
            <p>Expire Date: {new Date(selectedProduct.expireDate).toLocaleDateString()}</p>
            <p>Farmer: {selectedProduct.farmerId?.email}</p>
            {selectedProduct.photo && (
              <img
                src={selectedProduct.photo}
                alt={selectedProduct.productName}
                className="w-32 h-32 object-cover mt-2"
              />
            )}
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <textarea
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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

export default ManagerDashboard;