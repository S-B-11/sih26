import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, Satellite } from "lucide-react";

export function EvidencePanel({ evidence }) {
  const [open, setOpen] = useState(false);

  if (!evidence?.length) return null;

  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      overflow: "hidden",
      fontSize: 12,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text-2)",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <ShieldCheck size={12} color="var(--accent)" />
          <span style={{ fontWeight: 500, fontSize: 11 }}>Sources verified</span>
          <span style={{
            fontSize: 10,
            background: "var(--accent-dim)",
            color: "var(--accent)",
            border: "1px solid var(--accent-mid)",
            padding: "0 6px",
            borderRadius: 99,
          }}>{evidence.length}</span>
        </div>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--border)" }}>
          {evidence.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              gap: 10, padding: "8px 0",
              borderBottom: i < evidence.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Satellite size={11} color="var(--text-3)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 11, color: "var(--text)", lineHeight: 1.5, margin: 0 }}>{item.claim}</p>
                  <p style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{item.source}</p>
                </div>
              </div>
              {item.confidence && (
                <span style={{
                  fontSize: 10, fontWeight: 600, flexShrink: 0,
                  color: "#4ade80",
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.18)",
                  padding: "1px 6px",
                  borderRadius: 99,
                  fontFamily: "monospace",
                }}>{item.confidence}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
