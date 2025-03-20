import express from 'express';
import { addOrder, getOrdersByUserId } from '../controllers/orderController.js';

const router = express.Router();

// Add a new order
router.post('/add', addOrder);

// Get all orders for a specific user
router.get('/userOrder/:userId', getOrdersByUserId);

export default router;