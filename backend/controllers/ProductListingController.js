import ProductListing from '../models/ProductListing.js';
import jwt from 'jsonwebtoken';
import Marketplace from '../models/Marketplace.js';
import mongoose from 'mongoose';


export const wasteTypes = {
  'Organic Waste': ['Crop Residues', 'Fruit & Vegetable Waste','Plantation Waste',' Nut & Seed Waste','Livestock & Dairy Waste','Forestry Waste'],
  'Inorganic Waste': ['Chemical Waste','Plastic Waste', 'Metal Waste','Fabric & Textile Waste','Glass & Ceramic Waste','Rubber Waste'],
};

export const wasteItems = {
  'Crop Residues': ['Wheat straw', 'Rice husk', 'Corn stalks', 'Lentil husks', 'Chickpea stalks', 'Pea pods','Mustard stalks', 'Sunflower husks', 'Groundnut shells'],
  'Fruit & Vegetable Waste': ['Banana peels', 'Orange pulp', 'Mango peels', 'Tomato skins', 'Potato peels', 'Carrot tops','Rotten tomatoes', 'Overripe bananas'],
  'Plantation Waste': ['Tea leaves', 'Coffee husk', 'Coffee pulp', 'Bagasse', 'Molasses', 'Cane tops','Coconut husks', 'Shells', 'Leaves'],
  'Nut & Seed Waste': ['Peanut Shells', 'Almond & Cashew Husks','Sesame & Flaxseed Waste'],
  'Livestock & Dairy Waste': [' Cow dung', 'Poultry droppings', 'Goat manure', 'Bones', 'Blood', 'Skin leftovers','Whey', 'Spoiled milk', 'Butter residue'],
  'Forestry Waste': ['Sawdust & Wood Chips', 'Bamboo Waste', 'Leaf & Bark Residue'],
  'Chemical Waste': ['Expired Pesticides & Herbicides','Fertilizer Residues','Disinfectants & Cleaning Agents'],
  'Plastic Waste': ['Plastic bags','bottles','sachets','Mulching Films & Plastic Sheets','Drip Irrigation Pipes & Tubes','Greenhouse Plastic Covers'],
  'Metal Waste': ['Plows','Harrows','Blades','Wire Fencing & Metal Posts','Tractor parts','Gears','Bearings'],
  'Fabric & Textile Waste': ['Burlap Sacks & Jute Bags','Tarpaulins & Netting Materials','Gloves','Aprons','Coveralls'],
  'Glass & Ceramic Waste': ['Chemical Containers','Pesticide Bottles','Damaged Ceramic Pots & Storage Jars'],
  'Rubber Waste': ['Tires','Hoses','Conveyor Belts','Rubber Mats']
};

export const provinces = ['Nothern Province', 'North Central Province','North Western Province','Western Province','Central Province','Sabaragamuwa Province','Southern Province','Uva Province','Eastern Province'];
export const districts = {
  'Nothern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
  'North Western Province': ['Puttalam', 'Kurunegala'],
  'Western Province': ['Gampaha', 'Colombo', 'Kalutara'],
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Sabaragamuwa Province': ['Kegalle', 'Ratnapura'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota'],
  'Uva Province': ['Badulla', 'Monaragala'],
  'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
};

// Get Waste Types based on Waste Category
export const getWasteTypes = (req, res) => {
  const { wasteCategory } = req.params;
  const types = wasteTypes[wasteCategory] || [];
  res.json(types);
};

// Get Waste Items based on Waste Type
export const getWasteItems = (req, res) => {
  const { wasteType } = req.params;
  const items = wasteItems[wasteType] || [];
  res.json(items);
};

// Get Districts based on Province
export const getDistricts = (req, res) => {
  const { province } = req.params;
  const districtList = districts[province] || [];
  res.json(districtList);
};

// Create a new product listing
export const createProductListing = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?._id || req.user?.id;
        
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid user ID format' 
            });
        }

        const { wasteCategory, wasteType, wasteItem, province, district, city, 
                quantity, price, description, expireDate, photo } = req.body;

        // Validate required fields
        if (!wasteCategory || !wasteType || !wasteItem || !province || !district || 
            !city || !quantity || !price || !description || !expireDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newProductListing = new ProductListing({
            wasteCategory,
            wasteType,
            wasteItem,
            province,
            district,
            city,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            description,
            expireDate: new Date(expireDate),
            image: photo || null,
            farmerId: new mongoose.Types.ObjectId(userId), // Fixed: using userId
            status: 'Pending'
        });

        await newProductListing.save();
        
        return res.status(201).json({ 
            success: true,
            message: 'Product listing created successfully', 
            data: newProductListing 
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error creating product listing',
            error: error.message 
        });
    }
};
export const getAllProductListings = async (req, res) => {
    try {
      const listings = await ProductListing.find({})
        .populate('farmerId', 'name email'); // Populate farmer details
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const approveProductListing = async (req, res) => {
    try {
      const { listingId } = req.params;
  
      // Find the product listing
      const listing = await ProductListing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Product listing not found.' });
      }
  
      // Update status to "Approved"
      listing.status = 'Approved';
      await listing.save();
  
      // Move the approved listing to the Marketplace
      const marketplaceListing = new Marketplace({
        wasteItem: listing.wasteItem,
        farmerId: listing.farmerId,
        description: listing.description,
        district: listing.district,
        quantity: listing.quantity,
        price: listing.price,
        expireDate: listing.expireDate,
      });
      await marketplaceListing.save();
  
      res.status(200).json({ message: 'Product listing approved and moved to Marketplace.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteProductListing = async (req, res) => {
    try {
      const { listingId } = req.params;
  
      // Find and delete the product listing
      const deletedListing = await ProductListing.findByIdAndDelete(listingId);
      if (!deletedListing) {
        return res.status(404).json({ message: 'Product listing not found.' });
      }
  
      res.status(200).json({ message: 'Product listing deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

