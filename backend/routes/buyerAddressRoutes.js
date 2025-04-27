import express from "express";
// ✨ Updated controller import
import { saveOrUpdateBuyerAddress, getBuyerAddresses, getAddressByBuyerId } from "../controllers/buyerAddressController.js";

const router = express.Router();

// ✨ Updated this route to use saveOrUpdateBuyerAddress
router.post("/add", saveOrUpdateBuyerAddress);
router.get("/read", getBuyerAddresses);
router.get("/get-address/:buyerId", getAddressByBuyerId);

export default router;
