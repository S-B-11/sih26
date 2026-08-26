import { useState, useCallback, useEffect } from "react";
import { executeOrcaQuery } from "../data/mockBackend.js";

export function useOrcaQuery() {
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      sender: "assistant",
      text: "👋 Welcome to ORCA (Marine EcoSystem Reasoning with Collaborative Agents). Powered by ISRO Oceansat-3, INSAT-3DR, and INCOIS Ocean State Forecast.\n\nAsk any question about fishing zones (PFZ), maritime safety, cyclone alerts, or diagnostics in your native language.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk_level: "low",
      agent_trace: [],
      evidence: [],
      charts: []
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeAgentTrace, setActiveAgentTrace] = useState([]);
  const [currentMapLayers, setCurrentMapLayers] = useState(null);
  const [activeRiskAlerts, setActiveRiskAlerts] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [conversationContext, setConversationContext] = useState(null);

  // ── Proactive alert simulation on initial load (PS Requirement 2) ───────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveRiskAlerts((prev) => {
        // Only set if user hasn't already triggered alerts
        if (prev.length === 0) {
          return [
            {
              level: "medium",
              type: "hazard",
              message: "Proactive INCOIS Advisory: 3.2m swell alert active in Southwest offshore waters (Kochi–Lakshadweep corridor)."
            }
          ];
        }
        return prev;
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const runQuery = useCallback(async ({ text, presetId, language }) => {
    const lang = language || selectedLanguage;
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: text,
      timestamp: timestamp,
      language: lang
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setActiveAgentTrace([]);

    try {
      // 2. Execute Multi-Agent Pipeline with context & step callback
      const result = await executeOrcaQuery({
        text,
        presetId,
        language: lang,
        conversationContext,
        onAgentStep: (traceSteps) => {
          setActiveAgentTrace([...traceSteps]);
        }
      });

      // 3. Create Assistant Response
      const assistantMsg = {
        id: assistantMsgId,
        sender: "assistant",
        text: result.answer_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: result.language,
        risk_level: result.risk_level,
        agent_trace: result.agent_trace,
        evidence: result.evidence,
        charts: result.charts,
        map_layers: result.map_layers
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setCurrentMapLayers(result.map_layers);
      setActiveRiskAlerts(result.risk_alerts || []);
      setActiveAgentTrace(result.agent_trace);
      setSelectedScenarioId(result.scenarioId || presetId || null);

      // Update multi-turn conversation context
      setConversationContext({
        lastScenarioId: result.scenarioId || presetId || null,
        lastLocation: result.location || "Indian Coastal Waters",
        lastQuery: text,
        lastAnswer: result.answer_text,
        language: lang
      });

    } catch (err) {
      console.error("ORCA Query execution error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "⚠️ An error occurred while communicating with the Marine Multi-Agent System. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          risk_level: "high"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage, conversationContext]);

  const resetSession = useCallback(() => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "assistant",
        text: "👋 Session reset. Welcome to ORCA (Marine EcoSystem Reasoning with Collaborative Agents). Ask any ocean query or click a preset below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk_level: "low",
        agent_trace: [],
        evidence: [],
        charts: []
      }
    ]);
    setActiveAgentTrace([]);
    setCurrentMapLayers(null);
    setActiveRiskAlerts([]);
    setSelectedScenarioId(null);
    setConversationContext(null);
  }, []);

  return {
    messages,
    isLoading,
    activeAgentTrace,
    currentMapLayers,
    activeRiskAlerts,
    selectedLanguage,
    setSelectedLanguage,
    selectedScenarioId,
    conversationContext,
    runQuery,
    resetSession
  };
}
