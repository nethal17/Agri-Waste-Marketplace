import express from "express";
import { addOrderHistory, getOrderHistory, cancelOrder } from "../controllers/orderHistory.controller.js";

const router = express.Router();

router.post("/add", addOrderHistory); // After payment
router.get("/user/:userId", getOrderHistory); // Get user order history
router.delete("/cancel/:orderId", cancelOrder); // Cancel order

export default router;
