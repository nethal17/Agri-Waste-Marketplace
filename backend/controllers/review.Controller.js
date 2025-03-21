import Review from '../models/Review.js'; 
import Notification from '../models/Notifications.js';
import { sendNotificationEmail } from '../Utils/emailService.js';
import { User } from '../models/user.js';
import mongoose from 'mongoose';

// Add a review (Buyer)
export const addReview = async (req, res) => {
  try {
    const { productId, buyerId, rating, review } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ message: 'Invalid productId or buyerId.' });
    }

    const newReview = new Review({
      productId,
      buyerId,
      rating,
      review,
      image: req.file ? req.file.path : null, // Ensure req.file is populated
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully.', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to submit review.', error: error.message });
  }
};

// Publish a review (Manager)
export const publishReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Update review status to published
    review.status = 'published';
    await review.save();

    // Notify buyer that the review is published
    const buyerNotification = new Notification({
      userId: review.buyerId,
      message: 'Your review has been published.',
    });
    await buyerNotification.save();

    // Notify farmer about the new review
    const farmerNotification = new Notification({
      userId: review.farmerId,
      message: 'You have a new review for your product.',
    });
    await farmerNotification.save();

    // Send email notifications
    const buyer = await User.findById(review.buyerId);
    const farmer = await User.findById(review.farmerId);
    await sendNotificationEmail(buyer.email, 'Your review has been published.');
    await sendNotificationEmail(farmer.email, 'You have a new review for your product.');

    res.status(200).json({ message: 'Review published successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending reviews (Manager Dashboard)
export const getPendingReviews = async (req, res) => {
  try {
    const pendingReviews = await Review.find({ status: 'pending' }).populate('buyerId productId');
    res.status(200).json(pendingReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get published reviews (Marketplace)
export const getPublishedReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const publishedReviews = await Review.find({ productId, status: 'published' }).populate('buyerId');
    res.status(200).json(publishedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get average rating for a farmer
export const getFarmerAverageRating = async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Get all published reviews for the farmer
    const reviews = await Review.find({ farmerId, status: 'published' });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
