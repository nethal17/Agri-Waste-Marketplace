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
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log("No of Listings: ", listings.length);

  return (
    <div className="w-full p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Your Marketplace Listings</h2>
      
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-green-500 to-green-600">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">No</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Product</th>
                <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase md:table-cell">Description</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {listings.length > 0 ? (
                listings.map((listing, index) => (
                  <tr 
                    key={listing._id} 
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {listing.wasteItem}
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-600 md:table-cell">
                      {listing.description.length > 50 
                        ? `${listing.description.substring(0, 50)}...` 
                        : listing.description}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600 whitespace-nowrap">
                      ${listing.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600 whitespace-nowrap">
                      {listing.quantity} kg
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => viewListingDetails(listing._id)}
                          className="p-1 text-green-600 transition-colors rounded-full hover:text-green-800 hover:bg-green-100"
                          title="View Details"
                        >
                          <BsInfoCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(listing)}
                          className="p-1 text-red-600 transition-colors rounded-full hover:text-red-800 hover:bg-red-100"
                          title="Delete Listing"
                        >
                          <MdOutlineDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-sm text-center text-gray-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-green-600">
              <h3 className="text-lg font-semibold text-white">Listing Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200"
              >
                <BsX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Product Name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedListing.wasteItem}</p>
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
                    className="h-auto max-w-full mt-2 border border-gray-200 rounded-lg shadow-sm max-h-60"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 font-medium text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && listingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-500 to-red-600">
              <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-white hover:text-gray-200"
              >
                <BsX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Are you sure you want to delete the listing for <strong className="text-red-600">{listingToDelete.wasteItem}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end p-4 space-x-3 border-t">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 font-medium text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteListing}
                className="px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg shadow-md hover:bg-red-700"
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