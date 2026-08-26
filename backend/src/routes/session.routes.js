import express from "express";
import {
  getSessionHistory,
  saveSession,
  deleteSession
} from "../controllers/session.controller.js";

const router = express.Router();

/**
 * GET    /api/sessions/:userId   — Get full query history for a user/device
 * POST   /api/sessions           — Save a query+response as a session record
 * DELETE /api/sessions/:id       — Delete a specific session record
 */
router.get("/:userId",   getSessionHistory);
router.post("/",         saveSession);
router.delete("/:id",    deleteSession);

export default router;
