import React from "react";
import { BarChart2, TrendingUp, Info } from "lucide-react";
import { useOrca } from "../context/OrcaContext.jsx";
import { ChartCard } from "../chat/ChartCard.jsx";

export default function Analytics() {
  const { messages, t } = useOrca();

  // Collect all charts from all assistant messages
  const allCharts = messages
    .filter(m => m.sender === "assistant" && m.charts?.length > 0)
    .flatMap(m => m.charts.map(c => ({ ...c, fromQuery: m.text?.slice(0, 60) })));

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
          <BarChart2 size={18} color="var(--accent)" />
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", margin: 0 }}>
            {t("analyticsTitle")}
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>
          {t("analyticsSubtitle")}
        </p>
      </div>

      {allCharts.length === 0 ? (
        /* Empty state */
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
            background: "var(--surface)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={28} color="var(--text-3)" strokeWidth={1.5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)", marginBottom: 4 }}>
              {t("noChartsTitle")}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-3)", maxWidth: 280, lineHeight: 1.6 }}>
              {t("noChartsDesc")}
            </p>
          </div>
        </div>
      ) : (
        /* Charts grid */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
          gap: 20,
        }}>
          {allCharts.map((chart, idx) => (
            <div
              key={idx}
              className="fade-up"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 20,
                animationDelay: `${idx * 0.05}s`,
              }}
            >
              <ChartCard chart={chart} />
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      {allCharts.length > 0 && (
        <div style={{
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-3)",
          fontSize: 11,
        }}>
          <Info size={12} />
          {t("dataSourceNote")}
        </div>
      )}
    </div>
  );
}
