import express from "express";
import { createBuyerAddress, getBuyerAddresses, getAddressByBuyerId } from "../controllers/buyerAddressController.js";

const router = express.Router();

router.post("/add", createBuyerAddress);
router.get("/read", getBuyerAddresses);
router.get("/get-address/:buyerId", getAddressByBuyerId);

export default router;