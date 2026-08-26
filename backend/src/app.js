import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

// Routes
import queryRoutes from "./routes/query.routes.js";
import oceanRoutes from "./routes/ocean.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import sessionRoutes from "./routes/session.routes.js";

const app = express();

// ─── Database Connection ──────────────────────────────────────────────────────
connectDB();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ORCA Marine Intelligence API",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/query",   queryRoutes);    // Multi-agent AI query execution
app.use("/api/ocean",   oceanRoutes);    // PFZ zones, buoys, GeoJSON layers
app.use("/api/alerts",  alertRoutes);    // Risk alerts and maritime warnings
app.use("/api/sessions", sessionRoutes); // User session & query history

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
