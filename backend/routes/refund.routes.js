import express from "express";
import { createRefund, getRefunds, updateRefundStatus } from "../controllers/refund.controller.js";

const router = express.Router();

// Create a new refund
router.post("/add", createRefund);

// Get all refunds
router.get("/", getRefunds);

// Update refund status
router.patch("/:refundId/status", updateRefundStatus);

export default router; 