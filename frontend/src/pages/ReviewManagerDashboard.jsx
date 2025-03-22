import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ReviewManagerDashboard = () => {
  const [pendingReviews, setPendingReviews] = useState([]);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get('/api/reviews/pending');
      // Ensure the response is an array
      setPendingReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    }
  };

  const handlePublishReview = async (reviewId) => {
    try {
      await axios.put(`http://localhost:3000/api/reviews/publish/${reviewId}`);
      fetchPendingReviews(); // Refresh the list after publishing
    } catch (error) {
      console.error('Error publishing review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
      fetchPendingReviews(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-200">
              <th className="p-3">Buyer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Review</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingReviews.map((review) => (
              <tr key={review._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{review.buyerId?.name || "Unknown Buyer"}</td>
                <td className="p-3">{review.productId?.name || "Unknown Product"}</td>
                <td className="p-3">{review.rating}</td>
                <td className="p-3">{review.review}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handlePublishReview(review._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {/* Implement preview logic */}}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
