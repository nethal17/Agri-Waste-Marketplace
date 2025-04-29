// import { isAdmin } from '../middleware/auth.js';

import express from 'express';
import {addReview,publishReview,getPendingReviews,getPublishedReviews,getFarmerAverageRating,getFarmerReviews,
        deleteReview,getReviewDetails, getTopRandomReviews
        } from '../controllers/review.Controller.js'; 

const router = express.Router();


router.post('/add', addReview);
router.get('/random-top-reviews', getTopRandomReviews);
router.put('/publish/:reviewId', publishReview);
router.get('/pending', getPendingReviews);
router.get('/published/:productId', getPublishedReviews);
router.get('/average-rating/:farmerId', getFarmerAverageRating);
router.delete('/review-delete/:reviewId', deleteReview);
router.get('/details/:reviewId', getReviewDetails);
router.get('/farmer-reviews/:farmerId', getFarmerReviews);
//router.put('/publish/:reviewId', isAdmin, publishReview);

export default router;
