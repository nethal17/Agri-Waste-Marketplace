import express from 'express';
import { getWasteTypes, getWasteItems, getDistricts,createProductListing } from '../controllers/ProductListingController.js';
import {getAllProductListings,approveProductListing,deleteProductListing,} from '../controllers/ProductListingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Routes for dynamic dropdowns
router.get('/waste-types/:wasteCategory', getWasteTypes);
router.get('/waste-items/:wasteType', getWasteItems);
router.get('/districts/:province', getDistricts);

// Route for creating a product listing
router.post('/create', authMiddleware, createProductListing);

// Admin routes
router.get('/admin/listings',authMiddleware, getAllProductListings);
router.put('/admin/approve/:listingId',authMiddleware, approveProductListing);
router.delete('/admin/delete/:listingId',authMiddleware, deleteProductListing);

export default router;