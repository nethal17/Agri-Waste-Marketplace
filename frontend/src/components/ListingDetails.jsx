import { useEffect, useState } from "react";
import axios from "axios";
import { BsInfoCircle, BsX } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

export const ListingDetails = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!token || !userData?._id) {
        setListings([]);
        toast.error("Please login to view your listings");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/marketplace/farmer-listings/${userData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to fetch your listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const viewListingDetails = async (listingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/marketplace/listings-details/${listingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedListing(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error("Failed to fetch listing details");
      console.error(error);
    }
  };

  const confirmDelete = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const deleteListing = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/marketplace/listings-delete/${listingToDelete._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Listing deleted successfully");
      fetchListings(); // Refresh the listings
    } catch (error) {
      toast.error("Failed to delete listing");
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setListingToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Marketplace Listings</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-green-500 to-green-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {listings.length > 0 ? (
                listings.map((listing, index) => (
                  <tr 
                    key={listing._id} 
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {listing.wasteItem}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {listing.description.length > 50 
                        ? `${listing.description.substring(0, 50)}...` 
                        : listing.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${listing.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {listing.quantity} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => viewListingDetails(listing._id)}
                          className="text-green-600 hover:text-green-800 transition-colors p-1 rounded-full hover:bg-green-100"
                          title="View Details"
                        >
                          <BsInfoCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(listing)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100"
                          title="Delete Listing"
                        >
                          <MdOutlineDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="mt-2 text-gray-600">You don't have any listings in the marketplace yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-green-500 to-green-600">
              <h3 className="text-lg font-semibold text-white">Listing Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200"
              >
                <BsX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Product Name</p>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{selectedListing.wasteItem}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedListing.wasteCategory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="mt-1 text-sm font-semibold text-green-600">${selectedListing.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p className="mt-1 text-sm font-medium text-blue-600">{selectedListing.quantity} kg</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-sm text-gray-700">{selectedListing.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedListing.city}, {selectedListing.district}, {selectedListing.province}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedListing.expireDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {selectedListing.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Product Image</p>
                  <img 
                    src={selectedListing.image} 
                    alt={selectedListing.wasteItem}
                    className="mt-2 max-w-full h-auto max-h-60 rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && listingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-red-500 to-red-600">
              <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-white hover:text-gray-200"
              >
                <BsX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the listing for <strong className="text-red-600">{listingToDelete.wasteItem}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={deleteListing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};