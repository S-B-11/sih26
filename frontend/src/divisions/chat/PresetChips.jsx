import React from "react";
import { PRESET_QUERIES } from "../data/presetQueries.js";

export function PresetChips({ onSelectPreset, selectedLanguage }) {
  return (
    <div style={{ padding: "4px 0 8px" }}>
      <p style={{
        fontSize: 10,
        fontWeight: 600,
        color: "var(--text-3)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: 10,
      }}>Try an example</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {PRESET_QUERIES.map((preset) => {
          const text = preset.text[selectedLanguage] || preset.text.en;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset({ text, presetId: preset.id })}
              style={{
                textAlign: "left",
                padding: "10px 12px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
                width: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent-mid)";
                e.currentTarget.style.background = "var(--accent-dim)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface-2)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{preset.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: 12,
                    color: "var(--text)",
                    fontWeight: 500,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>{text}</p>
                  <p style={{
                    fontSize: 10,
                    color: "var(--text-3)",
                    margin: "2px 0 0",
                  }}>{preset.location}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
