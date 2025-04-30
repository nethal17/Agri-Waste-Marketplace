import express from "express";
import { registerVehicle, getAllVehicles, deleteVehicle, updateVehicleDetails } from "../controllers/VehicleReg.controller.js";
// import multer from "multer"; // Uncomment if you want file upload

const router = express.Router();

// const upload = multer({ dest: "uploads/" }); // For file upload

router.post("/register", registerVehicle);
router.get("/", getAllVehicles);
router.delete("/:id", deleteVehicle);
router.put("/:id", updateVehicleDetails); // Uncomment if you want to update vehicle details with file upload

export default router;