import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import UserRoutes from "./Routes/UserRoutes.js";
import ContactRoutes from "./Routes/ContactsRoutes.js";
import ReviewRoutes from "./Routes/ReviewRoutes.js";
import ProfileRoutes from "./Routes/ProfileRoutes.js";

import ConnectToDb from "./Utils/ConnectDb.js";

dotenv.config();

const app = express();
const _dirname = path.resolve();

// ✅ CORS FIX
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Connect MongoDB
ConnectToDb();

// ✅ API Routes
app.use("/api/user", UserRoutes);
app.use("/api/contacts", ContactRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/profile", ProfileRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});