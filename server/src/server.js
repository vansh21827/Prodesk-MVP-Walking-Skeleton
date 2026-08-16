import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dns from "dns";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
dns.setServers(["8.8.8.8"]);
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://prodesk-capstone-taskmatrix-lac.vercel.app/dashboard",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TaskMatrix API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TaskMatrix server running on port ${PORT}`);
  });
};

startServer();