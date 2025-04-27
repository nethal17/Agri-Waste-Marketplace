import Review from '../models/Review.js';
import OrderHistory from '../models/orderHistory.model.js';
import mongoose from 'mongoose';

// Add a review (Buyer)
export const addReview = async (req, res) => {
  try {
    const { productId, buyerId, orderId, rating, review } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || 
        !mongoose.Types.ObjectId.isValid(buyerId) ||
        !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid IDs provided.' });
    }

    const order = await OrderHistory.findOne({
      _id: orderId,
      userId: buyerId,
      orderStatus: 'toReview'
    });

    if (!order) {
      return res.status(403).json({ 
        message: 'You can only review products from valid orders.' 
      });
    }

    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this order.' 
      });
    }

    const newReview = new Review({
      productId,
      buyerId,
      orderId,
      rating,
      review,
      status: 'pending'
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

    // Validate buyerId and farmerId
    if (!mongoose.Types.ObjectId.isValid(review.buyerId)) {
      return res.status(400).json({ message: 'Invalid buyerId.' });
    }

    // Update review status to published
    review.status = 'published';
    await review.save();

    // Notify buyer and farmer (optional)
    const buyerNotification = new Notification({
      userId: review.buyerId,
      message: 'Your review has been published.',
    });
    await buyerNotification.save();

    const farmerNotification = new Notification({
      userId: review.farmerId,
      message: 'You have a new review for your product.',
    });
    await farmerNotification.save();

    // Send email notifications (optional)
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
    const pendingReviews = await Review.find({ status: 'pending' })
      .populate('buyerId', 'name email')
      .populate({
        path: 'productId',
        model: 'Marketplace',
        select: 'wasteItem description farmerId' // Include farmerId if needed
      });
    
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

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    // Delete the review and log the reason
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get review details by reviewId
export const getReviewDetails = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID.' });
    }

    const review = await Review.findById(reviewId)
      .populate('buyerId', 'name email')
      .populate({
        path: 'productId',
        model: 'Marketplace',
        select: 'wasteItem description price farmerId'
      });

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmerReviews = async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ message: 'Invalid farmer ID.' });
    }

    // Find all reviews for products belonging to this farmer
    const reviews = await Review.find()
      .populate({
        path: 'productId',
        match: { farmerId: farmerId },
        model: 'Marketplace',
        select: 'wasteItem'
      })
      .populate('buyerId', 'name email');

    // Filter out reviews that don't have a product (due to the match)
    const filteredReviews = reviews.filter(review => review.productId);

    if (filteredReviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this farmer.' });
    }

    res.status(200).json(filteredReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};