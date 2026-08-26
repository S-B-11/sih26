import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgentTracePanel } from "./AgentTracePanel.jsx";
import { EvidencePanel } from "./EvidencePanel.jsx";
import { ReasoningTrace } from "./ReasoningTrace.jsx";
import { PresetChips } from "./PresetChips.jsx";
import { InputArea } from "./InputArea.jsx";
import { Bot, User, BarChart2 } from "lucide-react";

export function ChatPanel({ messages, isLoading, activeAgentTrace, onSendQuery, selectedLanguage }) {
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeAgentTrace, isLoading]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--surface)",
      overflow: "hidden",
    }}>
      {/* Messages scroll area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className="fade-up"
              style={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 30, height: 30,
                borderRadius: 9,
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isUser
                  ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                  : "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.05))",
                border: isUser ? "none" : "1px solid var(--accent-mid)",
              }}>
                {isUser
                  ? <User size={14} color="#fff" />
                  : <Bot size={14} color="var(--accent)" />
                }
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: "84%", display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Sender + time */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: isUser ? "flex-end" : "flex-start",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>
                    {isUser ? "You" : "ORCA"}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "monospace" }}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Text bubble */}
                <div style={{
                  padding: "10px 14px",
                  borderRadius: isUser ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                  background: isUser
                    ? "linear-gradient(135deg, #2563eb, #4f46e5)"
                    : "var(--surface-2)",
                  border: isUser ? "none" : "1px solid var(--border)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: isUser ? "#fff" : "var(--text)",
                }}>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.text}</p>
                </div>

                {/* Charts link — navigate to Analytics instead of embedding */}
                {!isUser && msg.charts?.length > 0 && (
                  <button
                    onClick={() => navigate("/analytics")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      background: "var(--accent-dim)",
                      border: "1px solid var(--accent-mid)",
                      borderRadius: 8,
                      color: "var(--accent)",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      width: "fit-content",
                      fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(34,211,238,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--accent-dim)"}
                  >
                    <BarChart2 size={12} />
                    View {msg.charts.length} chart{msg.charts.length > 1 ? "s" : ""} in Analytics →
                  </button>
                )}

                {/* Multi-Agent Reasoning Trace (Collapsible) */}
                {!isUser && msg.agent_trace?.length > 0 && (
                  <ReasoningTrace agentTrace={msg.agent_trace} />
                )}

                {/* Evidence panel */}
                {!isUser && msg.evidence?.length > 0 && (
                  <EvidencePanel evidence={msg.evidence} />
                )}
              </div>
            </div>
          );
        })}

        {/* Live agent trace during execution */}
        {isLoading && (
          <AgentTracePanel activeTrace={activeAgentTrace} isLoading={isLoading} />
        )}

        {/* Preset chips when conversation is fresh */}
        {!isLoading && messages.length < 3 && (
          <PresetChips
            onSelectPreset={({ text, presetId }) => onSendQuery({ text, presetId, language: selectedLanguage })}
            selectedLanguage={selectedLanguage}
          />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <InputArea
        onSendQuery={onSendQuery}
        isLoading={isLoading}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
}
