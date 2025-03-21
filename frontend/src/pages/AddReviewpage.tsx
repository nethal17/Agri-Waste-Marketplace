import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LocationState {
  productId: string;
  buyerId: string;
}

const AddReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, buyerId } = (location.state as LocationState) || { productId: '', buyerId: '' };
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    console.log('Location State:', location.state); // Debugging
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Product Details:', response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setMessage('Product not found.');
          } else {
            console.error('Error fetching product details:', error.response?.data);
            setMessage('Failed to fetch product details. Please try again later.');
          }
        } else {
          console.error('Error fetching product details:', error);
          setMessage('Failed to fetch product details. Please try again later.');
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
  
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('buyerId', buyerId);
    formData.append('rating', rating.toString());
    formData.append('review', review);
  
    // Debugging: Log FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/reviews/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Review submitted successfully. It is pending approval.');
      navigate('/reviewDashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        setMessage(`Error: ${error.response?.data.message}`);
      } else {
        console.error('Error submitting review:', error);
        setMessage('Error submitting review.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product ID:</label>
          <input
            type="text"
            value={productId}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Buyer ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Buyer ID:</label>
          <input
            type="text"
            value={buyerId}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Rating Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating:</label>
          <div className="flex space-x-2 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl focus:outline-none ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                {star <= rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>

        {/* Review Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
          />
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Review
          </button>
        </div>
      </form>

      {/* Message Display */}
      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
      )}
    </div>
  );
};

export default AddReviewPage;