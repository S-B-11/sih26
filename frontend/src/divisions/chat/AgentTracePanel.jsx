import React, { useState } from "react";
import { AGENT_PIPELINE_STEPS } from "../data/mockBackend.js";
import { Cpu, CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export function AgentTracePanel({ activeTrace, isLoading }) {
  const [expanded, setExpanded] = useState(true);

  if (!isLoading && (!activeTrace || activeTrace.length === 0)) return null;

  const done = activeTrace.filter(t => t.status === "done").length;
  const pct = Math.round((done / AGENT_PIPELINE_STEPS.length) * 100);

  return (
    <div
      className="fade-up"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-2)",
        borderRadius: 12,
        padding: "12px 14px",
        marginTop: 4,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Cpu size={13} color="var(--accent)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: "0.04em" }}>
            Agent Pipeline
          </span>
          {isLoading && (
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: "var(--accent)",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-mid)",
              padding: "1px 7px",
              borderRadius: 99,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Loader2 size={10} className="animate-spin" /> Running
            </span>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "var(--surface-3)", borderRadius: 99, marginBottom: expanded ? 10 : 0, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${isLoading ? Math.max(pct, 8) : 100}%`,
          background: "linear-gradient(90deg, #22d3ee, #0ea5e9)",
          borderRadius: 99,
          transition: "width 0.35s ease",
        }} />
      </div>

      {/* Steps */}
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {AGENT_PIPELINE_STEPS.map((step) => {
            const trace = activeTrace.find(t => t.role === step.role || t.agent_name === step.name);
            const isDone = trace?.status === "done";
            const isRunning = trace?.status === "running" ||
              (isLoading && !trace && activeTrace.length === AGENT_PIPELINE_STEPS.indexOf(step));

            return (
              <div key={step.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 8px",
                borderRadius: 8,
                background: isRunning ? "var(--accent-dim)" : "transparent",
                border: `1px solid ${isRunning ? "var(--accent-mid)" : "transparent"}`,
                transition: "all 0.2s ease",
              }}>
                {isDone
                  ? <CheckCircle2 size={13} color="#4ade80" />
                  : isRunning
                  ? <Loader2 size={13} color="var(--accent)" className="animate-spin" />
                  : <span style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid var(--text-3)", display: "inline-block" }} />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: isDone ? "var(--text)" : isRunning ? "var(--accent)" : "var(--text-3)" }}>
                    {step.name}
                  </span>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600,
                  color: isDone ? "#4ade80" : isRunning ? "var(--accent)" : "var(--text-3)",
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}>
                  {isDone ? "DONE" : isRunning ? "..." : "WAIT"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
