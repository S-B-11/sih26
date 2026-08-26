import { OrcaQueryService } from "../services/orca.service.js";
import { AGENT_PIPELINE_STEPS } from "../utils/agentPipeline.js";

/**
 * POST /api/query
 * Runs the full ORCA multi-agent pipeline.
 */
export async function runOrcaQuery(req, res, next) {
  try {
    const { text, presetId, language = "en" } = req.body;

    if (!text && !presetId) {
      return res.status(400).json({
        success: false,
        error: "Either 'text' or 'presetId' is required."
      });
    }

    const result = await OrcaQueryService.execute({ text, presetId, language });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/query/agents
 * Returns the list of agent pipeline step definitions.
 */
export function getAgentPipelineSteps(_req, res) {
  res.status(200).json({
    success: true,
    data: AGENT_PIPELINE_STEPS
  });
}
