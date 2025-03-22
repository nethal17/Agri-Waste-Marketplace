import express from 'express';
import { createDriver, getAllDrivers, getDriverById, updateDriverSalary, getAllPayments } from "../controllers/driver.controller.js";
import { createCheckoutSession } from '../controllers/stripe.controller.js'; 

const router = express.Router();

// Define routes
router.post('/drivers', createDriver); // POST /api/drivers
router.get('/drivers', getAllDrivers); // GET /api/drivers
router.get('/drivers/:id', getDriverById); // GET /api/drivers/:id
router.put('/drivers/:id/salary', updateDriverSalary); // PUT /api/drivers/:id/salary
router.get('/drivers/payments', getAllPayments); // GET /api/drivers/payments
router.post('/create-checkout-session', createCheckoutSession);

export default router;