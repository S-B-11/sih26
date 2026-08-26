import React from "react";
import { Waves, Globe } from "lucide-react";
import { useOrca } from "../context/OrcaContext.jsx";
import { LANGUAGES } from "../data/presetQueries.js";

export default function TopBar({ onOpenSettings }) {
  const { t, selectedLanguage, setIsLanguageModalOpen } = useOrca();

  const currentLangObj = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

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
          }}>{t("appName")}</span>
          <span style={{
            marginLeft: 8,
            fontSize: 11,
            color: "var(--text-3)",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}>{t("appSubtitle")}</span>
        </div>
      </div>

      {/* Right: Language Switcher + ISRO badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Quick Language Switcher Button */}
        <button
          onClick={() => setIsLanguageModalOpen(true)}
          title="Change Native Language"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 8,
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            color: "var(--text)",
            fontSize: 11.5,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--accent-mid)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border-2)";
            e.currentTarget.style.color = "var(--text)";
          }}
        >
          <Globe size={13} color="var(--accent)" />
          <span>{currentLangObj.flag} {currentLangObj.native}</span>
        </button>

        <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--text-3)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>{t("isroBadge")}</span>
      </div>
    </header>
  );
}
