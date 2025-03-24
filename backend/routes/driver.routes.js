import express from 'express';
import { 
  createDriver, 
  getAllDrivers, 
  getDriverById, 
  updateDriverSalary, 
  getAllPayments,
  updateDriverDeliveryCount // Add this
} from "../controllers/driver.controller.js";
import { createCheckoutSession } from '../controllers/stripe.controller.js'; 

const router = express.Router();

// Define routes
router.post('/drivers', createDriver);
router.get('/drivers', getAllDrivers);
router.get('/drivers/:id', getDriverById);
router.put('/drivers/:id/salary', updateDriverSalary);
router.put('/drivers/:id/delivery-count', updateDriverDeliveryCount); // Add this route
router.get('/drivers/payments', getAllPayments);
router.post('/create-checkout-session', createCheckoutSession);

export default router;