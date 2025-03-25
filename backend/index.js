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
import cartRoutes from "./routes/cartRoutes.js";
import stripeRoutes from './routes/stripe.routes.js'
import webhookRoutes from './routes/webhook.routes.js';
import stripePaymentsRoutes from './routes/stripePayments.routes.js';
import driverPaymentsRoutes from './routes/driverPayments.routes.js';
import ProductListingRoutes from './routes/ProductListingRoutes.js';
import MarketplaceRoutes from './routes/MarketplaceRoutes.js';


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
app.use('/api', stripeRoutes);
app.use('/api', webhookRoutes);
app.use('/api', stripePaymentsRoutes);
app.use('/api', driverPaymentsRoutes);

//Ricky
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-listing', ProductListingRoutes);
app.use('/api/marketplace', MarketplaceRoutes);


//Naduli
app.use("/api/agri-waste", agriWasteRoutes);
app.use("/api/cart", cartRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


