import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Product } from "../types";
import { Navbar } from "@/components/Navbar";

const ManagerDashboard = () => {
  const [pendingListings, setPendingListings] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    setApproving(true);
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
    } finally {
      setApproving(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
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
        setDeleteReason("");
        fetchPendingListings(); // Refresh the list
      } else {
        toast.error("Deletion failed.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Pending Listings</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full">
          <thead className="bg-green-100"> {/* Changed to bg-green-100 */}
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Product Name</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Description</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Price</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Quantity</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingListings.map((listing) => (
              <tr key={listing._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-800 font-medium">{listing.productName}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{listing.description}</td>
                <td className="py-4 px-6 text-sm text-gray-700">${listing.price}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{listing.quantity}</td>
                <td className="py-4 px-6 text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedProduct(listing)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleApprove(listing._id)}
                      disabled={approving}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 disabled:bg-green-300 disabled:cursor-not-allowed"
                    >
                      {approving ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(listing._id);
                        setShowDeleteModal(true);
                      }}
                      disabled={deleting}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedProduct.productName}</h2>
            <div className="space-y-4">
              <p className="text-gray-700">{selectedProduct.description}</p>
              <p className="text-gray-700">Price: ${selectedProduct.price}</p>
              <p className="text-gray-700">Quantity: {selectedProduct.quantity}</p>
              <p className="text-gray-700">
                Expire Date: {new Date(selectedProduct.expireDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">Farmer: {selectedProduct.farmerId?.email}</p>
              {selectedProduct.photo && (
                <img
                  src={selectedProduct.photo}
                  alt={selectedProduct.productName}
                  className="w-40 h-40 object-cover rounded-lg shadow-md"
                />
              )}
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Delete Product</h2>
            <textarea
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason("");
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ManagerDashboard;