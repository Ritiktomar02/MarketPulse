import dotenv from "dotenv";

dotenv.config();

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db-connection.js";

import userRoute from "./routes/user-route.js";
import profileRoutes from "./routes/profile-route.js";
import marketRoute from "./routes/market-route.js";
import weatherRoute from "./routes/weather-route.js";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/market", marketRoute);
app.use("/api/weather", weatherRoute);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MarketPulse API is running",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Server running on port ${PORT}`);
    }
  });
};

startServer();
