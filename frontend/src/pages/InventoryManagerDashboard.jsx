import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Navbar } from "../components/Navbar";

export const InventoryManagerDashboard = () => {
  const [pendingListings, setPendingListings] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
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
      const data = await response.json();
      setPendingListings(data);
    } catch (error) {
      toast.error("Failed to fetch pending listings.");
    }
  };

  const handleApprove = async (id) => {
    setApproving(true);
    try {
      const response = await fetch(`http://localhost:3000/api/inventory/approve/${id}`, {
        method: "PUT",
      });
      if (response.ok) {
        toast.success("Product approved!");
        fetchPendingListings();
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
        fetchPendingListings();
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
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Pending Listings</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead className="bg-green-100">
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
                      <button onClick={() => setSelectedProduct(listing)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Preview
                      </button>
                      <button onClick={() => handleApprove(listing._id)} disabled={approving} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        {approving ? "Approving..." : "Approve"}
                      </button>
                      <button onClick={() => {
                        setProductToDelete(listing._id);
                        setShowDeleteModal(true);
                      }} disabled={deleting} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
