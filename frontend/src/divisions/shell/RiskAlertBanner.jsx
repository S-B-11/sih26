import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, MapPin, X } from "lucide-react";

export default function RiskAlertBanner({ alerts }) {
  const [dismissed, setDismissed] = useState(false);

  const primary = alerts?.find(a => a.level === "high") || alerts?.find(a => a.level === "medium");

  if (!primary || dismissed || alerts.length === 0) return null;

  const isHigh = primary.level === "high";
  const isGeofence = primary.type === "geofence";

  const bannerBg = isGeofence
    ? "linear-gradient(90deg, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.06) 100%)"
    : isHigh
    ? "linear-gradient(90deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.08) 100%)"
    : "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.06) 100%)";

  const borderColor = isGeofence
    ? "rgba(56,189,248,0.25)"
    : isHigh
    ? "rgba(239,68,68,0.25)"
    : "rgba(251,191,36,0.2)";

  const tagColor = isGeofence
    ? "#38bdf8"
    : isHigh
    ? "var(--danger)"
    : "var(--warning)";

  return (
    <div
      className="alert-enter"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: 40,
        background: bannerBg,
        borderBottom: `1px solid ${borderColor}`,
        flexShrink: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {isGeofence ? (
          <MapPin size={14} color="#38bdf8" style={{ flexShrink: 0 }} />
        ) : isHigh ? (
          <AlertTriangle size={14} color="var(--danger)" style={{ flexShrink: 0 }} />
        ) : (
          <ShieldAlert size={14} color="var(--warning)" style={{ flexShrink: 0 }} />
        )}

        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: tagColor,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.03em",
        }}>
          {isGeofence ? "GEOFENCE" : isHigh ? "ALERT" : "ADVISORY"}
        </span>

        <span style={{
          fontSize: 12,
          color: "var(--text-2)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {primary.message}
        </span>

        {alerts.length > 1 && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: tagColor,
            background: isGeofence ? "rgba(56,189,248,0.12)" : isHigh ? "var(--danger-bg)" : "var(--warning-bg)",
            padding: "1px 6px",
            borderRadius: 99,
            flexShrink: 0,
          }}>+{alerts.length - 1} more</span>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        style={{
          width: 24, height: 24, borderRadius: 6,
          background: "transparent", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--text-3)",
          flexShrink: 0, marginLeft: 12,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
