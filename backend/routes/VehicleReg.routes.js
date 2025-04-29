import express from "express";
import { registerVehicle } from "../controllers/VehicleReg.controller.js";
// import multer from "multer"; // Uncomment if you want file upload

const router = express.Router();

// const upload = multer({ dest: "uploads/" }); // For file upload

router.post("/register", registerVehicle);

export default router;