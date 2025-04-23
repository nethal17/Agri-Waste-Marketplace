import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Navbar } from '../components/Navbar';

export const InventoryManagerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        navigate("/login");
      }
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userRole = userData.role;
      if (userRole !== "admin") {
        toast.error("Only Admin can list agri-waste");
        navigate("/");
      }

      const response = await axios.get('http://localhost:3000/api/product-listing/admin/listings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListings(response.data);
      
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings. Please try again.');
    }
  };

  const pendingListings = listings.filter((listing) => listing.status === 'Pending');

  const handleApprove = async (listingId) => {
    setApproving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        return;
      }

      await axios.put(`http://localhost:3000/api/product-listing/admin/approve/${listingId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Listing approved and moved to Marketplace.');
      fetchListings();
    } catch (error) {
      console.error('Error approving listing:', error);
      toast.error('Failed to approve listing. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found, please login again.');
        return;
      }

      await axios.delete(`http://localhost:3000/api/product-listing/admin/delete/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { reason: deleteReason },
      });

      toast.success('Listing deleted successfully.');
      setShowDeleteModal(false);
      setDeleteReason('');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = (listing) => {
    setSelectedProduct(listing);
    setShowPreviewModal(true);
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
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Farmer</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Product</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Description</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Price</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Quantity</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingListings.map((listing) => (
                <tr key={listing._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-800 font-medium">{listing.farmerId?.name || 'Unknown Farmer'}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{listing.wasteItem}</td>
                  <td className="py-4 px-6 text-sm text-gray-700 max-w-xs truncate">{listing.description}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">Rs.{listing.price}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{listing.quantity}</td>
                  <td className="py-4 px-6 text-sm">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handlePreview(listing)} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => handleApprove(listing._id)} 
                        disabled={approving} 
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        {approving ? 'Approving...' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => {
                          setProductToDelete(listing._id);
                          setShowDeleteModal(true);
                        }} 
                        disabled={deleting} 
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Preview Modal - Enhanced Design */}
        {showPreviewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Product Listing Details</h3>
                  <button 
                    onClick={() => setShowPreviewModal(false)} 
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Product Image */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Product Image</h4>
                      {selectedProduct.image ? (
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.wasteItem}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500">No image available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Product Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Product Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Farmer Name</p>
                          <p className="font-medium mt-1">{selectedProduct.farmerId?.name || 'Unknown Farmer'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Waste Item</p>
                          <p className="font-medium mt-1">{selectedProduct.wasteItem}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Waste Type</p>
                          <p className="font-medium mt-1">{selectedProduct.wasteType || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium mt-1">{selectedProduct.wasteCategory || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Pricing & Quantity</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Price (Per Kg)</p>
                          <p className="font-medium mt-1 text-green-600">Rs.{selectedProduct.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Quantity Available</p>
                          <p className="font-medium mt-1 text-blue-600">{selectedProduct.quantity} KG</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Location & Expiry</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium mt-1">
                            {selectedProduct.city}, {selectedProduct.district}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="font-medium mt-1">
                            {selectedProduct.expireDate ? new Date(selectedProduct.expireDate).toLocaleDateString() : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Description</h4>
                      <p className="text-gray-700">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-xl font-semibold mb-4">Delete Product</h3>
              <p className="mb-4">Are you sure you want to delete this product?</p>
              <textarea
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Reason for deletion..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};