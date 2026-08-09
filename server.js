import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import itemRouter from "./routes/itemsRoute.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//============================= Start Server =====================================
connectDB();
app.listen(PORT, () => {
  console.log(`Server is operating on port: ${PORT}`);
});

// ==========================Middleware==================================
app.use(
  cors({
    origin: [
      "https://lost-and-found-iota-six.vercel.app",
      "https://devtunnels.ms",

      "https://zkx589fb-5173.inc1.devtunnels.ms",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/item", itemRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// ===============================Route==========================================
app.get("/", (req, res) => {
  res.send("MERN Backend Server is running smoothly!");
});
