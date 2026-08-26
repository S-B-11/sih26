import { useState, useCallback, useEffect } from "react";
import { executeOrcaQuery } from "../data/mockBackend.js";
import { getTranslation } from "../data/translations.js";

const STORAGE_LANG_KEY = "orca_preferred_language";

export function useOrcaQuery() {
  const savedLang = typeof window !== "undefined" ? localStorage.getItem(STORAGE_LANG_KEY) : null;
  const initialLang = savedLang || "en";

  const [selectedLanguage, setSelectedLanguageState] = useState(initialLang);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(!savedLang);

  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      sender: "assistant",
      text: getTranslation(initialLang, "welcomeText"),
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
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [conversationContext, setConversationContext] = useState(null);

  // Translation helper bound to current language
  const t = useCallback((key) => {
    return getTranslation(selectedLanguage, key);
  }, [selectedLanguage]);

  // Set language with persistence & welcome message refresh
  const setSelectedLanguage = useCallback((lang) => {
    setSelectedLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    }
    // Refresh welcome message if it's the only message in session
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome-msg") {
        return [
          {
            id: "welcome-msg",
            sender: "assistant",
            text: getTranslation(lang, "welcomeText"),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            risk_level: "low",
            agent_trace: [],
            evidence: [],
            charts: []
          }
        ];
      }
      return prev;
    });
  }, []);

  // ── Proactive alert simulation on initial load (PS Requirement 2) ───────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveRiskAlerts((prev) => {
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
        text: getTranslation(selectedLanguage, "welcomeText"),
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
  }, [selectedLanguage]);

  return {
    messages,
    isLoading,
    activeAgentTrace,
    currentMapLayers,
    activeRiskAlerts,
    selectedLanguage,
    setSelectedLanguage,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    selectedScenarioId,
    conversationContext,
    t,
    runQuery,
    resetSession
  };
}
