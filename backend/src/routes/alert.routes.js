import express from "express";
import {
  getActiveAlerts,
  createAlert,
  dismissAlert
} from "../controllers/alert.controller.js";

const router = express.Router();

/**
 * GET    /api/alerts           — Get all active maritime alerts
 * POST   /api/alerts           — Create a new alert (admin / INCOIS sync)
 * DELETE /api/alerts/:id       — Dismiss an alert
 */
router.get("/",         getActiveAlerts);
router.post("/",        createAlert);
router.delete("/:id",   dismissAlert);

export default router;
