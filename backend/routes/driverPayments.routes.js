import express from 'express';
import { getDriverPayments } from '../controllers/driverPayments.controller.js';

const router = express.Router();

// Define the route for fetching driver payments
router.get('/driver-payments/:driverId', getDriverPayments);

export default router;