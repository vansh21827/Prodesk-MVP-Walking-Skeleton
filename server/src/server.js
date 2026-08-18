import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

dns.setServers(["8.8.8.8"]);

const app = express();

const allowedOrigin =
  process.env.CLIENT_URL ||
  "https://prodesk-mvp-walking-skeleton.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
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

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TaskMatrix API is healthy",
  });
});

const PORT = process.env.PORT || 5000;

/*
 * Local development only.
 * Vercel will use the exported Express app.
 */
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `TaskMatrix server running on port ${PORT}`
    );
  });
}

export default app;
