import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";

export const ListingReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
            setReviews(null);
            toast.error("No token found, please login again.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const farmerId = userData._id;
        
        const response = await axios.get(`http://localhost:3000/api/reviews/farmer-reviews/${farmerId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-center text-lg font-semibold">No reviews found.</p>
      ) : (
        <div className="w-full h-full p-6">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="border border-slate-600 rounded-md">No</th>
                <th className="border border-slate-600 rounded-md">Rating</th>
                <th className="border border-slate-600 rounded-md">Review</th>
                <th className="border border-slate-600 rounded-md">Buyer</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={review._id}>
                  <td className="border border-slate-600 rounded-md">{index + 1}</td>
                  <td className="border border-slate-600 rounded-md">{review.rating}</td>
                  <td className="border border-slate-600 rounded-md">{review.review}</td>
                  <td className="border border-slate-600 rounded-md">{}
                    <Link to={`/profile/${review.buyerId}`}>
                      <BsInfoCircle className="text-blue-500" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}