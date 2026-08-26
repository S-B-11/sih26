import React, { useState } from "react";
import { useOrca } from "../context/OrcaContext.jsx";
import { ChevronDown, ChevronUp, Bot, CheckCircle2 } from "lucide-react";

export function ReasoningTrace({ agentTrace }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useOrca();

  if (!agentTrace || agentTrace.length === 0) return null;

  return (
    <div style={{
      marginTop: 6,
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: "var(--surface)",
      overflow: "hidden",
      fontSize: 12,
      fontFamily: "inherit",
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 10px",
          background: isOpen ? "var(--surface-2)" : "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text-2)",
          fontFamily: "inherit",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "var(--surface-2)"; }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Bot size={13} color="var(--accent)" />
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>
            {t("agentReasoningTrace")}
          </span>
          <span style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 99,
            background: "var(--accent-dim)",
            color: "var(--accent)",
            fontWeight: 600,
          }}>
            {agentTrace.length} {t("agentsCollaborated")}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-3)" }}>
          <span style={{ fontSize: 10 }}>{isOpen ? t("hide") : t("show")}</span>
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </button>

      {isOpen && (
        <div style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          {agentTrace.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                position: "relative",
              }}
            >
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                background: "rgba(74, 222, 128, 0.12)",
                border: "1px solid rgba(74, 222, 128, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}>
                <CheckCircle2 size={11} color="#4ade80" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)" }}>
                    {step.agent_name || step.role}
                  </span>
                  {step.timestamp && (
                    <span style={{ fontSize: 9, color: "var(--text-3)", fontFamily: "monospace" }}>
                      {step.timestamp}
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize: 11,
                  color: "var(--text-2)",
                  margin: "2px 0 0",
                  lineHeight: 1.4,
                }}>
                  {step.contribution || step.details || "Processed domain logic and forwarded findings to pipeline."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
