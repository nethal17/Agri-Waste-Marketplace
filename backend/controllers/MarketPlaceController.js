import mongoose from 'mongoose';
import Marketplace from '../models/Marketplace.js';

export const getFarmerListings = async (req, res) => {
    try {
      const { farmerId } = req.params;
  
      // Validate farmerId
      if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return res.status(400).json({ message: 'Invalid farmerId.' });
      }
  
      // Find all products associated with the farmer
      const products = await Marketplace.find({ farmerId: farmerId}); // Populate farmer details
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No listings found for this farmer.' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getListingDetails = async (req, res) => {
    try {
      const { listingId } = req.params;
  
      // Validate listingId
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({ message: 'Invalid listing ID.' });
      }
  
      // Find the listing
      const listing = await Marketplace.findById(listingId).populate('farmerId', 'name email');
  
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found.' });
      }
  
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteListing = async (req, res) => {
    try {
      const { listingId } = req.params;
  
      // Validate listingId
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({ message: 'Invalid listing ID.' });
      }
  
      // Find and delete the listing
      const deletedListing = await Marketplace.findByIdAndDelete(listingId);
  
      if (!deletedListing) {
        return res.status(404).json({ message: 'Listing not found.' });
      }
  
      res.status(200).json({ message: 'Listing deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid product ID.' 
            });
        }

        // Find the product and populate farmer details
        const product = await Marketplace.findById(productId)
            .populate('farmerId', 'name email phone')
            .select('-__v'); // Exclude version key

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found.' 
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching product',
            error: error.message 
        });
    }
};  