import express from 'express';
import { getProductById } from '../controllers/productController.js'; // Import the controller

const router = express.Router();

// Route to get product details by ID
router.get('/:productId', getProductById);

export default router;