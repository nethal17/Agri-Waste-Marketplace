import express from "express";
import { addToCart, getCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);

export default router;