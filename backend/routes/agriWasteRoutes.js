import express from "express";
import { getAllWaste, createWaste } from "../controllers/agriWasteController.js";

const router = express.Router();

router.get("/all", getAllWaste);
router.post("/create", createWaste);

export default router;