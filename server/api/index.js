import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "../src/config/db.js";
import authRoutes from "../src/routes/authRoutes.js";
import projectRoutes from "../src/routes/projectRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "TaskMatrix API is running",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "TaskMatrix API and MongoDB are connected",
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;
