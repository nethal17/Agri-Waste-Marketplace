import ProductListing from '../models/ProductListing.js';
import jwt from 'jsonwebtoken';
import Marketplace from '../models/Marketplace.js';
import mongoose from 'mongoose';
import nodemailer from "nodemailer";
import { User } from "../models/user.js"


export const wasteTypes = {
  'Organic Waste': ['Crop Residues', 'Fruit & Vegetable Waste','Plantation Waste','Nut & Seed Waste','Livestock & Dairy Waste','Forestry Waste'],
  'Inorganic Waste': ['Chemical Waste','Plastic Waste', 'Metal Waste','Fabric & Textile Waste','Glass & Ceramic Waste','Rubber Waste'],
};

export const wasteItems = {
  'Crop Residues': ['Wheat straw', 'Rice husk', 'Corn stalks', 'Lentil husks', 'Chickpea stalks', 'Pea pods','Mustard stalks', 'Sunflower husks', 'Groundnut shells'],
  'Fruit & Vegetable Waste': ['Banana peels', 'Orange pulp', 'Mango peels', 'Tomato skins', 'Potato peels', 'Carrot tops','Rotten tomatoes', 'Overripe bananas'],
  'Plantation Waste': ['Tea leaves', 'Coffee husk', 'Coffee pulp', 'Bagasse', 'Molasses', 'Cane tops','Coconut husks', 'Shells', 'Leaves'],
  'Nut & Seed Waste': ['Peanut Shells', 'Almond & Cashew Husks','Sesame & Flaxseed Waste'],
  'Livestock & Dairy Waste': ['Cow dung', 'Poultry droppings', 'Goat manure', 'Abattoir Waste (Bones, Blood, Skin leftovers)','Whey', 'Spoiled milk', 'Butter residue'],
  'Forestry Waste': ['Sawdust & Wood Chips', 'Bamboo Waste', 'Leaf & Bark Residue'],
  'Chemical Waste': ['Expired Pesticides & Herbicides','Fertilizer Residues','Disinfectants & Cleaning Agents'],
  'Plastic Waste': ['Pesticide & Fertilizer Packaging (Plastic bags, bottles, sachets)','Mulching Films & Plastic Sheets','Drip Irrigation Pipes & Tubes','Greenhouse Plastic Covers'],
  'Metal Waste': ['Rusty Farm Equipment & Tools (Plows, Harrows, Blades)','Wire Fencing & Metal Posts','Discarded Machinery Parts (Tractor parts, Gears, Bearings)'],
  'Fabric & Textile Waste': ['Burlap Sacks & Jute Bags','Tarpaulins & Netting Materials','Old Protective Gear (Gloves, Aprons, Coveralls)'],
  'Glass & Ceramic Waste': ['Chemical Containers','Pesticide Bottles','Damaged Ceramic Pots & Storage Jars'],
  'Rubber Waste': ['Used Tires from Tractors & Farm Vehicles','Rubber Seals & Hoses','Discarded Conveyor Belts']
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
              quantity, price, description, expireDate, photo,
              bankName, accountNumber, accountHolderName, branch } = req.body;

      // Validate required fields
      if (!wasteCategory || !wasteType || !wasteItem || !province || !district || 
          !city || !quantity || !price || !description || !expireDate ||
          !bankName || !accountNumber || !accountHolderName || !branch) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Get farmer details for email notification
      const farmer = await User.findById(userId);
      if (!farmer) {
          return res.status(404).json({ 
              success: false,
              message: 'Farmer not found' 
          });
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
          farmerId: new mongoose.Types.ObjectId(userId),
          status: 'Pending',
          bankName,
          accountNumber,
          accountHolderName,
          branch
      });

      await newProductListing.save();
      
      // Send email notification to farmer
      try {
          const transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: { 
                  user: process.env.EMAIL_USER, 
                  pass: process.env.EMAIL_PASS 
              }
          });

          const mailOptions = {
              to: farmer.email,
              from: process.env.EMAIL_USER,
              subject: `Your ${wasteItem} Listing is Under Review`,
              html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #4CAF50;">AgriWaste Management</h2>
                      <p>Dear ${farmer.name || 'Valued Farmer'},</p>
                      
                      <p>Thank you for listing your agricultural waste product with us!</p>
                      
                      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                          <h3 style="margin-top: 0;">Product Details</h3>
                          <p><strong>Product Name:</strong> ${wasteItem}</p>
                          <p><strong>Category:</strong> ${wasteCategory}</p>
                          <p><strong>Type:</strong> ${wasteType}</p>
                          <p><strong>Quantity:</strong> ${quantity} kg</p>
                          <p><strong>Price:</strong> Rs. ${price} per kg</p>
                          <p><strong>Location:</strong> ${city}, ${district}, ${province}</p>
                      </div>
                      
                      <p>Your listing "<strong>${wasteItem}</strong>" is currently under review by our team. 
                      We will notify you once it has been approved and published on our marketplace.</p>
                      
                      <p>If you have any questions, please don't hesitate to contact our support team.</p>
                      
                      <p>Best regards,<br>The AgriWaste Management Team</p>
                      
                      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
                          <p>This is an automated message. Please do not reply directly to this email.</p>
                      </div>
                  </div>
              `
          };

          await transporter.sendMail(mailOptions);
      } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
      }

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
      .populate('farmerId', 'name email');
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveProductListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await ProductListing.findById(listingId).populate('farmerId');
    if (!listing) {
      return res.status(404).json({ message: 'Product listing not found.' });
    }

    // Update status to "Approved"
    listing.status = 'Approved';
    await listing.save();

    // Move to Marketplace
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

    // Send approval email to farmer
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { 
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            to: listing.farmerId.email,
            from: process.env.EMAIL_USER,
            subject: `Your ${listing.wasteItem} Listing Has Been Approved`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">AgriWaste Management</h2>
                    <p>Dear ${listing.farmerId.name || 'Valued Farmer'},</p>
                    
                    <p>We're pleased to inform you that your product listing has been approved!</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Product Details</h3>
                        <p><strong>Product Name:</strong> ${listing.wasteItem}</p>
                        <p><strong>Quantity:</strong> ${listing.quantity} kg</p>
                        <p><strong>Price:</strong> Rs. ${listing.price} per kg</p>
                        <p><strong>Status:</strong> Approved</p>
                    </div>
                    
                    <p>Your product is now visible to potential buyers on our marketplace.</p>
                    
                    <p>Best regards,<br>The AgriWaste Management Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
    }

    res.status(200).json({ message: 'Product listing approved and moved to Marketplace.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const deletedListing = await ProductListing.findByIdAndDelete(listingId).populate('farmerId');
    if (!deletedListing) {
      return res.status(404).json({ message: 'Product listing not found.' });
    }

    // Send deletion notification email to farmer
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { 
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            to: deletedListing.farmerId.email,
            from: process.env.EMAIL_USER,
            subject: `Your ${deletedListing.wasteItem} Listing Has Been Removed`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">AgriWaste Management</h2>
                    <p>Dear ${deletedListing.farmerId.name || 'Valued Farmer'},</p>
                    
                    <p>We're informing you that your product listing has been removed from our system.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Product Details</h3>
                        <p><strong>Product Name:</strong> ${deletedListing.wasteItem}</p>
                        <p><strong>Reason:</strong> Listing removed by admin</p>
                    </div>
                    
                    <p>If you believe this was done in error, please contact our support team.</p>
                    
                    <p>Best regards,<br>The AgriWaste Management Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (emailError) {
        console.error('Failed to send deletion email:', emailError);
    }

    res.status(200).json({ message: 'Product listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

