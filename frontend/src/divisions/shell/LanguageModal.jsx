import React, { useState } from "react";
import { LANGUAGES } from "../data/presetQueries.js";
import { getTranslation } from "../data/translations.js";
import { Globe, Waves, Check, ArrowRight } from "lucide-react";

export default function LanguageModal({ isOpen, onClose, selectedLanguage, onSelectLanguage }) {
  const [tempLang, setTempLang] = useState(selectedLanguage || "en");

  if (!isOpen) return null;

  const t = (key) => getTranslation(tempLang, key);

  const handleConfirm = () => {
    onSelectLanguage(tempLang);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(3, 7, 18, 0.82)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16,
      animation: "fadeIn 0.25s ease",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 540,
        background: "var(--surface)",
        border: "1px solid var(--border-2)",
        borderRadius: 20,
        padding: "28px 28px 24px",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(34, 211, 238, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(34,211,238,0.25), rgba(34,211,238,0.05))",
            border: "1px solid var(--accent-mid)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}>
            <Waves size={24} color="var(--accent)" />
          </div>

          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}>
            ISRO SIH26176 · ORCA
          </div>

          <h2 style={{
            fontSize: 19,
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 6px",
            lineHeight: 1.3,
          }}>
            {t("modalTitle")}
          </h2>

          <p style={{
            fontSize: 12.5,
            color: "var(--text-2)",
            margin: 0,
            maxWidth: 420,
            lineHeight: 1.5,
          }}>
            {t("modalSubtitle")}
          </p>
        </div>

        {/* Language Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
        }}>
          {LANGUAGES.map((lang) => {
            const isSelected = tempLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setTempLang(lang.code)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: isSelected ? "var(--accent-dim)" : "var(--surface-2)",
                  border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                  color: isSelected ? "var(--accent)" : "var(--text)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.background = "var(--surface-3)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--surface-2)";
                  }
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{lang.flag}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{lang.native}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
                    {lang.label}
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 99,
                    background: "var(--accent)",
                    color: "#060d1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          <button
            onClick={handleConfirm}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
              border: "none",
              color: "#060d1a",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(34, 211, 238, 0.35)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <span>{t("modalContinue")}</span>
            <ArrowRight size={16} />
          </button>

          <p style={{
            fontSize: 11,
            color: "var(--text-3)",
            textAlign: "center",
            margin: 0,
          }}>
            {t("modalHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
