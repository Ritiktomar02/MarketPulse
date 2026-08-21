import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db-connection.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Server is running");
});


const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Server running on port ${PORT}`);
    }
  });
};

startServer();
