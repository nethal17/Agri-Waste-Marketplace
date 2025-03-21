import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { FaStar } from 'react-icons/fa';

interface LocationState {
  productId: string;
  buyerId: string;
}

const AddReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, buyerId } = (location.state as LocationState) || { productId: '', buyerId: '' };
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    console.log('Location State:', location.state);
    if (!productId || !buyerId) {
      setMessage('Product ID or Buyer ID is missing.');
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found, please login again.');
          setMessage('Authentication error. Please login again.');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Product Details:', response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.status === 404 ? 'Product not found.' : 'Failed to fetch product details.');
        } else {
          setMessage('Failed to fetch product details.');
        }
      }
    };

    fetchProductDetails();
  }, [productId, buyerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !buyerId) {
      setMessage('Product ID or Buyer ID is missing.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/reviews/add',
        { productId, buyerId, rating, review },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage('Review submitted successfully. It is pending approval.');
      navigate('/reviewDashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(`Error: ${error.response?.data.message}`);
      } else {
        setMessage('Error submitting review.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product ID:</label>
            <input
              type="text"
              value={productId}
              readOnly
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Buyer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Buyer ID:</label>
            <input
              type="text"
              value={buyerId}
              readOnly
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Rating Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating:</label>
            <div className="flex space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className={`cursor-pointer transition-colors ${
                    star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Write your review here..."
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit Review
            </button>
          </div>
        </form>

        {/* Message Display */}
        {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
      </div>
    </>
  );
};

export default AddReviewPage;
