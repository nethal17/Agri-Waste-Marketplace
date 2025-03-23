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
import productRoutes from "./routes/productRoutes.js";
import driverRoutes from './routes/driver.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import agriWasteRoutes from "./routes/agriWasteRoutes.js";


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

//vibhu
app.use('/api', driverRoutes);
app.use('/api', paymentRoutes);

//Ricky
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

<<<<<<< Updated upstream
app.use('/api/product', productRoutes);

//Naduli
app.use("/api/agri-waste", agriWasteRoutes);

=======
>>>>>>> Stashed changes
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



