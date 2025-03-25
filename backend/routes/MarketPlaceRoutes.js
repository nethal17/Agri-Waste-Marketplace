import express from 'express';
import { getFarmerListings,getListingDetails,deleteListing,getProductById,getAllListings } from '../controllers/MarketPlaceController.js';

const router = express.Router();

router.get('/farmer-listings/:farmerId', getFarmerListings);
router.get('/listings-details/:listingId', getListingDetails);
router.delete('/listings-delete/:listingId', deleteListing);
router.get('/product/:productId', getProductById);
router.get('/listings', getAllListings);

export default router;

