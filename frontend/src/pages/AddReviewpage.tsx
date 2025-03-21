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
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found, please login again.');
          setMessage('Authentication error. Please login again.');
          return;
        }

        if (!productId) {
          setMessage('Product ID is missing.');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Product Details:', response.data);

      } catch (error) {
        console.error('Error fetching product details:', error);
        setMessage('Failed to fetch product details. Please try again later.');
      }
    };

    if (productId) {
      fetchProductDetails();
    } else {
      setMessage('Product ID is missing.');
    }
  }, [productId]);

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
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/reviews/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Review submitted successfully. It is pending approval.');
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        setMessage(`Error: ${error.response?.data.message || 'Failed to submit review.'}`);
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Review
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
      )}
    </div>
  );
};

export default AddReviewPage;