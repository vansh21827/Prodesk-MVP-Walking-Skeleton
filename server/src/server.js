import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

/* =========================
   CORS
========================= */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://prodesk-mvp-walking-skeleton-u4xi.vercel.app",
  "https://prodesk-mvp-walking-skeleton-3uqcapow4-vansh-bansal.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskMatrix API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskMatrix backend is healthy",
    database:
      mongooseConnectionReady(),
  });
});

/* =========================
   DATABASE CONNECTION
========================= */

let databaseConnected = false;

const ensureDatabaseConnection = async () => {
  if (databaseConnected) {
    return;
  }

  await connectDB();

  databaseConnected = true;

  console.log("MongoDB connected successfully");
};

/* =========================
   ROUTES
========================= */

app.use("/api/auth", async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error(
      "Database connection failed:",
      error
    );

    return res.status(500).json({
      message: "Database connection failed",
    });
  }
}, authRoutes);

app.use("/api/projects", async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error(
      "Database connection failed:",
      error
    );

    return res.status(500).json({
      message: "Database connection failed",
    });
  }
}, projectRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  console.error("API Error:", error);

  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : error.message,
  });
});

/* =========================
   HELPER
========================= */

function mongooseConnectionReady() {
  try {
    return databaseConnected;
  } catch {
    return false;
  }
}

/* =========================
   LOCAL DEVELOPMENT ONLY
========================= */

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  ensureDatabaseConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `TaskMatrix server running on port ${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error(
        "Failed to start local server:",
        error
      );
      process.exit(1);
    });
}

export default app;
