import React from "react";
import { AlertTriangle, ShieldAlert, Shield, CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrca } from "../context/OrcaContext.jsx";

export default function Alerts() {
  const { activeRiskAlerts, t } = useOrca();
  const navigate = useNavigate();

  const displayAlerts = activeRiskAlerts.length > 0 ? activeRiskAlerts : [];

  const LEVEL_CONFIG = {
    high:   { color: "var(--danger)",  bg: "var(--danger-bg)",  icon: AlertTriangle, label: t("highAlertTag") },
    medium: { color: "var(--warning)", bg: "var(--warning-bg)", icon: ShieldAlert,   label: t("advisoryTag") },
    low:    { color: "#4ade80",        bg: "rgba(74,222,128,0.10)", icon: Shield,    label: t("normalTag") },
  };

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      background: "var(--bg)",
      padding: "32px 36px",
    }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <AlertTriangle size={18} color="var(--danger)" />
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", margin: 0 }}>
            {t("alertsTitle")}
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>
          {t("alertsSubtitle")}
        </p>
      </div>

      {displayAlerts.length === 0 ? (
        /* All-clear state */
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60%",
          gap: 16,
          color: "var(--text-3)",
        }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: 16,
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CheckCircle2 size={28} color="#4ade80" strokeWidth={1.5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#4ade80", marginBottom: 4 }}>
              {t("allClearTitle")}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-3)", maxWidth: 280, lineHeight: 1.6 }}>
              {t("allClearDesc")}
            </p>
          </div>

          {/* Prompt to run a query */}
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: 8,
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-mid)",
              borderRadius: 8,
              color: "var(--accent)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {t("runSafetyQuery")}
            <ExternalLink size={12} />
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 740 }}>
          {displayAlerts.map((alert, idx) => {
            const isGeofence = alert.type === "geofence";
            const cfg = isGeofence
              ? { color: "#38bdf8", bg: "rgba(56,189,248,0.12)", icon: MapPin, label: t("geofenceTag") }
              : (LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.low);
            const Icon = cfg.icon;

            return (
              <div
                key={idx}
                className="fade-up"
                style={{
                  padding: "18px 20px",
                  background: "var(--surface)",
                  border: `1px solid ${cfg.color}28`,
                  borderLeft: `3px solid ${cfg.color}`,
                  borderRadius: 12,
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: 9,
                    background: cfg.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: cfg.color,
                        letterSpacing: "0.08em",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>{cfg.label}</span>

                      {alert.zoneName && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#38bdf8",
                          background: "rgba(56,189,248,0.1)",
                          border: "1px solid rgba(56,189,248,0.25)",
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}>
                          {alert.zoneName}
                        </span>
                      )}

                      <span style={{ fontSize: 10, color: "var(--text-3)" }}>
                        {isGeofence ? "MoES / Coast Guard GIS" : "INCOIS OSF"}
                      </span>
                    </div>

                    <p style={{
                      fontSize: 13,
                      color: "var(--text)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}>{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
