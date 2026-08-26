import React, { useState } from "react";
import { MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import { useOrca } from "../context/OrcaContext.jsx";
import { MapPanel } from "../map/MapPanel.jsx";
import { ChatPanel } from "../chat/ChatPanel.jsx";
import RiskAlertBanner from "../shell/RiskAlertBanner.jsx";

const CHAT_WIDTH = 364;

export default function Home() {
  const { currentMapLayers, activeRiskAlerts, messages, isLoading, activeAgentTrace, selectedLanguage, runQuery } = useOrca();
  const [chatOpen, setChatOpen] = useState(true);

  const handleSendQuery = ({ text, presetId, language }) => {
    runQuery({ text, presetId, language: language || selectedLanguage });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Thin alert banner — only if active */}
      <RiskAlertBanner alerts={activeRiskAlerts} />

      {/* Main body: Map + Chat */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* ── Map (dominant, fills remaining width) ─────────────────────── */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <MapPanel geojson={currentMapLayers} chatOpen={chatOpen} />

          {/* Chat open/close toggle tab on the map edge */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            title={chatOpen ? "Collapse chat" : "Open chat"}
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              zIndex: 500,
              width: 22,
              height: 56,
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              borderRight: "none",
              borderRadius: "6px 0 0 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-3)",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
          >
            {chatOpen ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* ── Chat panel (collapsible, fixed width) ─────────────────────── */}
        <div style={{
          width: chatOpen ? CHAT_WIDTH : 0,
          minWidth: 0,
          overflow: "hidden",
          flexShrink: 0,
          transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "var(--surface)",
          borderLeft: chatOpen ? "1px solid var(--border)" : "none",
        }}>
          {/* Inner wrapper keeps full width so content doesn't squish during transition */}
          <div style={{ width: CHAT_WIDTH, height: "100%", overflow: "hidden" }}>
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              activeAgentTrace={activeAgentTrace}
              onSendQuery={handleSendQuery}
              selectedLanguage={selectedLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
