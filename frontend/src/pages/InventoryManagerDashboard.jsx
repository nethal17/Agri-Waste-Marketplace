import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPackage, FiCheck, FiTrash2, FiEye } from 'react-icons/fi';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <FiPackage className="w-10 h-10 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pending Listings</h1>
              <p className="text-gray-600 mt-1">Review and manage product listings from farmers</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm font-medium">Total Pending</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Today
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{pendingListings.length}</p>
          </div>
          {/* Add more stat cards as needed */}
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {pendingListings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-800">
                            {(listing.farmerId?.name || 'Unknown')[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{listing.farmerId?.name || 'Unknown Farmer'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{listing.wasteItem}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{listing.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Rs.{listing.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {listing.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handlePreview(listing)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <FiEye className="w-4 h-4 mr-1.5" />
                          Preview
                        </button>
                        <button 
                          onClick={() => handleApprove(listing._id)}
                          disabled={approving}
                          className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <FiCheck className="w-4 h-4 mr-1.5" />
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            setProductToDelete(listing._id);
                            setShowDeleteModal(true);
                          }}
                          disabled={deleting}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4 mr-1.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingListings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-sm">No pending listings to review</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">Product Details</h3>
                  <p className="text-gray-500 mt-1">Review the product information before making a decision</p>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                  {selectedProduct.image ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.wasteItem}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <FiPackage className="w-20 h-20 text-gray-400" />
                      <p className="text-gray-500 mt-4">No image available</p>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Farmer Information</label>
                      <div className="mt-2 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-lg font-medium text-green-800">
                            {(selectedProduct.farmerId?.name || 'Unknown')[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-lg font-medium text-gray-900">{selectedProduct.farmerId?.name || 'Unknown Farmer'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Product Details</label>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-500">Product Type</p>
                          <p className="text-lg font-medium text-gray-900">{selectedProduct.wasteItem}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-lg font-medium text-green-600">Rs.{selectedProduct.price}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="text-lg font-medium text-blue-600">{selectedProduct.quantity} units</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="text-lg font-medium text-orange-600">Pending</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="mt-2 text-gray-700 bg-white p-4 rounded-lg border border-gray-100">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setProductToDelete(selectedProduct._id);
                    setShowPreviewModal(false);
                    setShowDeleteModal(true);
                  }}
                  className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
                >
                  <FiTrash2 className="w-5 h-5 mr-2" />
                  Decline Listing
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleApprove(selectedProduct._id);
                  }}
                  disabled={approving}
                  className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                >
                  <FiCheck className="w-5 h-5 mr-2" />
                  {approving ? 'Approving...' : 'Approve Listing'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete/Decline Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                  <FiTrash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">Decline Listing</h3>
                  <p className="text-gray-600 mt-1">Please provide a reason for declining this listing. This will be sent to the farmer.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="decline-reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Declining
                  </label>
                  <textarea
                    id="decline-reason"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="4"
                    placeholder="Enter your reason for declining this listing..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteReason('');
                      setProductToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(productToDelete)}
                    disabled={!deleteReason.trim() || deleting}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                  >
                    <FiTrash2 className="w-5 h-5 mr-2" />
                    {deleting ? 'Declining...' : 'Decline Listing'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};