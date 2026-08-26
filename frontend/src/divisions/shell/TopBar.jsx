import React from "react";
import { Waves } from "lucide-react";

export default function TopBar({ onOpenSettings }) {
  return (
    <header style={{
      height: "var(--topbar-h)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
      flexShrink: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: 9,
          background: "linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.05) 100%)",
          border: "1px solid rgba(34,211,238,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Waves size={16} color="var(--accent)" />
        </div>
        <div>
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.08em",
            background: "linear-gradient(90deg, #22d3ee 0%, #67e8f9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>ORCA</span>
          <span style={{
            marginLeft: 8,
            fontSize: 11,
            color: "var(--text-3)",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}>Marine Intelligence</span>
        </div>
      </div>

      {/* Right: ISRO badge only */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--text-3)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>ISRO · SIH26176</span>
      </div>
    </header>
  );
}
