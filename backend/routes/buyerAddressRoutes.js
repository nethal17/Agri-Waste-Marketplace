import express from "express";
import { createBuyerAddress, getBuyerAddresses } from "../controllers/buyerAddressController.js";

const router = express.Router();

router.post("/add", createBuyerAddress);
router.get("/read", getBuyerAddresses);

export default router;