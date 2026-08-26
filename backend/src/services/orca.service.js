import { AGENT_PIPELINE_STEPS } from "../utils/agentPipeline.js";
import { SCENARIOS, generateCustomResponse } from "../utils/scenarios.js";

/**
 * OrcaQueryService
 * Core business logic for the ORCA multi-agent pipeline execution.
 * In production: replace with real LangGraph/FastAPI calls.
 * In dev/staging: uses the rich mock scenario engine.
 */
export class OrcaQueryService {
  /**
   * Determine which scenario to use based on presetId or query text.
   */
  static resolveScenario(text = "", presetId, language) {
    if (presetId && SCENARIOS[presetId]) {
      return SCENARIOS[presetId];
    }
    const lower = text.toLowerCase();
    if (lower.includes("pfz") || lower.includes("fishing"))       return SCENARIOS["pfz-today"];
    if (lower.includes("safe") || lower.includes("high wave"))    return SCENARIOS["sea-safety"];
    if (lower.includes("tide") || lower.includes("weather"))      return SCENARIOS["tide-weather"];
    if (lower.includes("cyclone") || lower.includes("lightning")) return SCENARIOS["cyclone-lightning"];
    if (lower.includes("route") || lower.includes("boat"))        return SCENARIOS["safest-route"];
    return generateCustomResponse(text, language);
  }

  /**
   * Execute the multi-agent pipeline for a given query.
   * Returns the full structured response including agent trace.
   */
  static async execute({ text, presetId, language = "en" }) {
    const scenario = this.resolveScenario(text, presetId, language);
    const trace = [];

    // Simulate step-by-step agent execution
    for (const agent of AGENT_PIPELINE_STEPS) {
      await new Promise((res) => setTimeout(res, agent.duration));
      trace.push({
        agent_name: agent.name,
        role: agent.role,
        status: "done",
        details: agent.details,
        timestamp: new Date().toISOString()
      });
    }

    const selectedAnswer =
      typeof scenario.answer_text === "object"
        ? scenario.answer_text[language] || scenario.answer_text.en
        : scenario.answer_text;

    return {
      answer_text: selectedAnswer,
      language,
      risk_level:  scenario.risk_level,
      map_layers:  scenario.map_layers,
      charts:      scenario.charts      || [],
      risk_alerts: scenario.risk_alerts || [],
      evidence:    scenario.evidence    || [],
      agent_trace: trace
    };
  }
}
