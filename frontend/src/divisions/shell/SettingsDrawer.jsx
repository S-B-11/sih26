import React from "react";
import { X, Radio, RotateCcw, Check, Sun, Moon, Monitor } from "lucide-react";
import { useOrca } from "../context/OrcaContext.jsx";
import { LANGUAGES } from "../data/presetQueries.js";

const SATELLITES = [
  { name: "Oceansat-3", status: "Synced", detail: "OCM-3 · SST & Chl-a" },
  { name: "INSAT-3DR",  status: "Synced", detail: "Sounder · Radar" },
  { name: "INCOIS OSF", status: "Live",   detail: "Ocean State Forecast" },
];

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export default function SettingsDrawer({ isOpen, onClose }) {
  const { selectedLanguage, setSelectedLanguage, messages, resetSession, theme, setTheme } = useOrca();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Drawer */}
      <aside style={{
        position: "fixed",
        top: 0, right: 0,
        width: 320,
        height: "100%",
        background: "var(--surface)",
        borderLeft: "1px solid var(--border-2)",
        zIndex: 210,
        display: "flex",
        flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "-12px 0 48px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Settings</h2>
            <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Language & data sources</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            background: "transparent", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-2)",
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          {/* Language */}
          <Section label="Language">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: 8,
                    background: selectedLanguage === lang.code ? "var(--accent-dim)" : "transparent",
                    border: `1px solid ${selectedLanguage === lang.code ? "var(--accent-mid)" : "transparent"}`,
                    color: selectedLanguage === lang.code ? "var(--accent)" : "var(--text-2)",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 13 }}>
                    <span style={{ marginRight: 8 }}>{lang.flag}</span>
                    {lang.native}
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-3)" }}>
                      {lang.label}
                    </span>
                  </span>
                  {selectedLanguage === lang.code && <Check size={13} />}
                </button>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Appearance */}
          <Section label="Appearance">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {THEMES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={theme === id}
                  onClick={() => setTheme(id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "10px 4px", borderRadius: 8,
                    background: theme === id ? "var(--accent-dim)" : "transparent",
                    border: `1px solid ${theme === id ? "var(--accent-mid)" : "var(--border)"}`,
                    color: theme === id ? "var(--accent)" : "var(--text-2)",
                    cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Satellite Status */}
          <Section label="Data Sources">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SATELLITES.map((sat) => (
                <div key={sat.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "var(--surface-2)",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Radio size={13} color="var(--accent)" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{sat.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 1 }}>{sat.detail}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: "#4ade80",
                    background: "rgba(74,222,128,0.10)",
                    border: "1px solid rgba(74,222,128,0.20)",
                    padding: "2px 8px",
                    borderRadius: 99,
                  }}>{sat.status}</span>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Session History */}
          <Section label={`Session History (${messages.length - 1} queries)`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
              {messages.filter(m => m.sender === "user").length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-3)", padding: "8px 0" }}>No queries yet.</p>
              ) : (
                messages
                  .filter(m => m.sender === "user")
                  .map((m) => (
                    <div key={m.id} style={{
                      padding: "8px 10px",
                      background: "var(--surface-2)",
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                    }}>
                      <p style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.4 }}
                         className="line-clamp-2">{m.text}</p>
                      <p style={{ fontSize: 10, color: "var(--text-3)", marginTop: 3 }}>{m.timestamp}</p>
                    </div>
                  ))
              )}
            </div>
          </Section>
        </div>

        {/* Footer: Reset */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => { resetSession(); onClose(); }}
            style={{
              width: "100%", padding: "9px 0",
              background: "transparent",
              border: "1px solid var(--border-2)",
              borderRadius: 8,
              color: "var(--text-2)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-2)"; }}
          >
            <RotateCcw size={13} />
            Reset Session
          </button>
        </div>
      </aside>
    </>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />;
}
