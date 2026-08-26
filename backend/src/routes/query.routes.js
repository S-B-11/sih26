import express from "express";
import {
  runOrcaQuery,
  getAgentPipelineSteps
} from "../controllers/query.controller.js";

const router = express.Router();

/**
 * POST /api/query
 * Body: { text, presetId, language }
 * Runs the full ORCA multi-agent pipeline and returns:
 * answer_text, map_layers, risk_alerts, charts, evidence, agent_trace
 */
router.post("/", runOrcaQuery);

/**
 * GET /api/query/agents
 * Returns the static list of agent pipeline step definitions
 */
router.get("/agents", getAgentPipelineSteps);

export default router;
