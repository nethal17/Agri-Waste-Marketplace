import express from 'express';
import { getFarmerListings,getListingDetails,deleteListing,getProductById } from '../controllers/MarketPlaceController.js';

const router = express.Router();

router.get('/farmer-listings/:farmerId', getFarmerListings);
router.get('/listings-details/:listingId', getListingDetails);
router.delete('/listings-delete/:listingId', deleteListing);
router.get('/product/:productId', getProductById);


export default router;

