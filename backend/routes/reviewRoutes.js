import express from 'express';
import {
  addReview,
  publishReview,
  getPendingReviews,
  getPublishedReviews,
  getFarmerAverageRating,
  deleteReview,
  getReviewDetails,
  getFarmerReviews
} from '../controllers/review.Controller.js'; // Correct path

const router = express.Router();


router.post('/add', addReview);
router.put('/publish/:reviewId', publishReview);
router.get('/pending', getPendingReviews);
router.get('/published/:productId', getPublishedReviews);
router.get('/average-rating/:farmerId', getFarmerAverageRating);
router.delete('/review-delete/:reviewId', deleteReview);
router.get('/details/:reviewId', getReviewDetails);
router.get('/farmer-reviews/:farmerId', getFarmerReviews);

export default router;
