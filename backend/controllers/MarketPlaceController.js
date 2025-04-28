import mongoose from 'mongoose';
import Marketplace from '../models/Marketplace.js';
import ProductListing from '../models/ProductListing.js';

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

export const getAllListings = async (req, res) => {
  try {
    const listings = await Marketplace.find().populate('farmerId', 'name email');
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWasteByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate category
    if (!category) {
      return res.status(400).json({ 
        success: false,
        message: 'Category is required.' 
      });
    }

    // Define waste types for each category
    const wasteTypes = {
      'Organic Waste': ['Crop Residues', 'Fruit & Vegetable Waste', 'Plantation Waste', 'Nut & Seed Waste', 'Livestock & Dairy Waste', 'Forestry Waste'],
      'Inorganic Waste': ['Chemical Waste', 'Plastic Waste', 'Metal Waste', 'Fabric & Textile Waste', 'Glass & Ceramic Waste', 'Rubber Waste']
    };

    // Get the waste types for the requested category
    const categoryWasteTypes = wasteTypes[category] || [];

    // Find all products where wasteItem matches any of the category's waste types
    const products = await Marketplace.find({
      wasteItem: { $in: categoryWasteTypes }
    })
    .populate('farmerId', 'name email phone')
    .select('-__v'); // Exclude version key

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No products found in this category.' 
      });
    }

    res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching products by category',
      error: error.message 
    });
  }
};

export const getWasteDetailsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate category
    if (!category) {
      return res.status(400).json({ 
        success: false,
        message: 'Category is required.' 
      });
    }

    // Find all product listings in the specified category
    const products = await ProductListing.find({ 
      wasteCategory: category,
      status: 'Approved' // Only get approved listings
    })
    .populate('farmerId', 'name phone')
    .select('-__v'); // Exclude version key

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No waste details found in this category.' 
      });
    }

    // Transform the data to include waste type details
    const wasteDetails = products.map(product => ({
      _id: product._id,
      wasteCategory: product.wasteCategory,
      wasteType: product.wasteType,
      wasteItem: product.wasteItem,
      description: product.description,
      location: {
        province: product.province,
        district: product.district,
        city: product.city
      },
      quantity: product.quantity,
      price: product.price,
      expireDate: product.expireDate,
      image: product.image,
      farmer: {
        name: product.farmerId?.name,
        email: product.farmerId?.email,
        phone: product.farmerId?.phone
      }
    }));

    res.status(200).json({
      success: true,
      data: wasteDetails
    });

  } catch (error) {
    console.error('Error fetching waste details by category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching waste details by category',
      error: error.message 
    });
  }
};

export const getWasteDetailsByType = async (req, res) => {
  try {
    const { wasteType } = req.params;

    // Validate waste type
    if (!wasteType) {
      return res.status(400).json({ 
        success: false,
        message: 'Waste type is required.' 
      });
    }

    // Create a case-insensitive regex for the waste type
    const wasteTypeRegex = new RegExp(wasteType.replace(/\s+/g, '\\s*'), 'i');

    // Find all product listings with the specified waste type
    const products = await ProductListing.find({ 
      $or: [
        { wasteType: wasteTypeRegex },
        { wasteItem: wasteTypeRegex }
      ],
      status: 'Approved' // Only get approved listings
    })
    .populate('farmerId', 'name phone email')
    .select('-__v'); // Exclude version key

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: `No waste details found for ${wasteType}.` 
      });
    }

    // Transform the data to include waste details
    const wasteDetails = products.map(product => ({
      _id: product._id,
      wasteCategory: product.wasteCategory,
      wasteType: product.wasteType,
      wasteItem: product.wasteItem,
      description: product.description,
      location: {
        province: product.province,
        district: product.district,
        city: product.city
      },
      quantity: product.quantity,
      price: product.price * 1.2,
      expireDate: product.expireDate,
      image: product.image,
      farmerId: product.farmerId,
      farmer: {
        name: product.farmerId?.name,
        email: product.farmerId?.email,
        phone: product.farmerId?.phone
      }
    }));

    res.status(200).json({
      success: true,
      data: wasteDetails
    });

  } catch (error) {
    console.error('Error fetching waste details by type:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching waste details by type',
      error: error.message 
    });
  }
};
