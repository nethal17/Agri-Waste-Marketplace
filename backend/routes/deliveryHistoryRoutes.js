import express from "express";
import {
  getAllDeliveryOrders,
  acceptOrder,
  declineOrder,
} from "../controllers/deliveryHistory.controller.js";

const router = express.Router();

router.get("/delivery-orders", getAllDeliveryOrders);
router.put("/delivery-orders/:id/accept", acceptOrder);
router.put("/delivery-orders/:id/decline", declineOrder);

export default router;