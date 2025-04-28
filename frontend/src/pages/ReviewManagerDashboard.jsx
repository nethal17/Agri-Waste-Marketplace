import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { FaCheck, FaTrash, FaEye, FaSpinner } from 'react-icons/fa'; 

export const ReviewManagerDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reviews/pending?timestamp=${Date.now()}`);
      setPendingReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      toast.error('Failed to fetch pending reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishReview = async (reviewId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/reviews/publish/${reviewId}`);
      if (response.status === 200) {
        toast.success('Review published successfully!');
        fetchPendingReviews(); // Refresh the list of pending reviews
      } else {
        toast.error('Failed to publish review. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing review:', error);
      toast.error('Failed to publish review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/reviews/review-delete/${reviewId}`);
      fetchPendingReviews();
      toast.success('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  /*const handlePreviewReview = async (reviewId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reviews/details/${reviewId}`);
      setSelectedReview(response.data); // Set the selected review
      setIsPreviewModalOpen(true); // Open the preview modal
    } catch (error) {
      console.error('Error fetching review details:', error);
      toast.error('Failed to fetch review details. Please try again.');
    }
  };*/

  console.log(pendingReviews);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Reviews</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                  
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="p-4 text-left">Buyer</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Rating</th>
                  <th className="p-4 text-left">Review</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((review) => (
                  <tr
                    key={review._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-gray-700">{review.buyerId?.name || "Unknown Buyer"}</td>
                    <td className="p-4 text-gray-700">{review.productName || "Unknown Product"}</td>
                    <td className="p-4 text-gray-700">{review.rating}</td>
                    <td className="p-4 text-gray-700">{review.review}</td>
                    <td className="p-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handlePublishReview(review._id)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          title="Publish"
                        >
                          <FaCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          title="Delete"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};