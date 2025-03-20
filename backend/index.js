import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import photoRouter from "./routes/profileRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Agri-Waste Backend API is Running...");
});

//Nethal
app.use("/api/auth", router);
app.use("/api/users", userRouter);
app.use("/api/photo", photoRouter);

//Ricky
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



