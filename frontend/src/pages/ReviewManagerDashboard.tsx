import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Review {
  _id: string;
  buyerId: { name: string };
  productId: { name: string };
  rating: number;
  review: string;
}

const ManagerDashboard: React.FC = () => {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get<Review[]>('/api/reviews/pending');
      setPendingReviews(response.data);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    }
  };

  const handlePublishReview = async (reviewId: string) => {
    try {
      await axios.put(`http://localhost:3000/api/reviews/publish/${reviewId}`);
      fetchPendingReviews(); // Refresh the list after publishing
    } catch (error) {
      console.error('Error publishing review:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`);
      fetchPendingReviews(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div>
      <h2>Pending Reviews</h2>
      <table>
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingReviews.map((review) => (
            <tr key={review._id}>
              <td>{review.buyerId.name}</td>
              <td>{review.productId.name}</td>
              <td>{review.rating}</td>
              <td>{review.review}</td>
              <td>
                <button onClick={() => handlePublishReview(review._id)}>Publish</button>
                <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                <button onClick={() => {/* Implement preview logic */}}>Preview</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDashboard;