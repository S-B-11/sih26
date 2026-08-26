import React, { useState } from "react";
import { useOrca } from "../context/OrcaContext.jsx";
import { useVoiceInput } from "../hooks/useVoiceInput.js";
import { detectLanguage } from "../utils/detectLanguage.js";
import { Send, Mic, MicOff, Globe } from "lucide-react";

export function InputArea({ onSendQuery, isLoading, selectedLanguage }) {
  const [inputText, setInputText] = useState("");
  const { t } = useOrca();

  const { isListening, audioLevel, transcript, startListening, stopListening } = useVoiceInput({
    language: selectedLanguage,
    onSpeechResult: (text) => setInputText(text),
  });

  const activeText = inputText || transcript;
  const detectedLang = detectLanguage(activeText);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputText.trim() || transcript.trim();
    if (!query || isLoading) return;
    const finalLang = detectedLang ? detectedLang.code : selectedLanguage;
    onSendQuery({ text: query, language: finalLang });
    setInputText("");
  };

  const toggleMic = () => isListening ? stopListening() : startListening();

  return (
    <div style={{
      padding: "12px 14px",
      borderTop: "1px solid var(--border)",
      background: "var(--surface)",
      flexShrink: 0,
    }}>
      {/* Auto-detected language pill */}
      {detectedLang && detectedLang.code !== selectedLanguage && (
        <div style={{
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          color: "var(--accent)",
        }}>
          <Globe size={11} />
          <span>{t("autoDetected")}: <strong>{detectedLang.name}</strong></span>
          <span style={{ fontSize: 10, color: "var(--text-3)" }}>({t("willRespondIn")} {detectedLang.name})</span>
        </div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <div style={{
          marginBottom: 10,
          padding: "8px 12px",
          background: "var(--accent-dim)",
          border: "1px solid var(--accent-mid)",
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mic size={13} color="var(--accent)" className="animate-pulse" />
            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>{t("listening")}</span>
            {transcript && (
              <span style={{ fontSize: 11, color: "var(--text-2)", fontStyle: "italic", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {transcript}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", height: 16, gap: 1.5 }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className="audio-bar" style={{ height: `${Math.max(4, (audioLevel * (i + 1)) % 18)}px` }} />
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={t("inputPlaceholder")}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "9px 14px",
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            borderRadius: 10,
            color: "var(--text)",
            fontSize: 13,
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.15s ease",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent-mid)"}
          onBlur={e => e.target.style.borderColor = "var(--border-2)"}
        />

        <button
          type="button"
          onClick={toggleMic}
          title={isListening ? "Stop" : "Voice input"}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            border: `1px solid ${isListening ? "rgba(248,113,113,0.4)" : "var(--border-2)"}`,
            background: isListening ? "var(--danger-bg)" : "var(--surface-2)",
            color: isListening ? "var(--danger)" : "var(--text-3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            flexShrink: 0,
          }}
        >
          {isListening ? <MicOff size={15} /> : <Mic size={15} />}
        </button>

        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !transcript.trim())}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            border: "none",
            background: (isLoading || (!inputText.trim() && !transcript.trim()))
              ? "var(--surface-3)"
              : "linear-gradient(135deg, #22d3ee, #0891b2)",
            color: (isLoading || (!inputText.trim() && !transcript.trim()))
              ? "var(--text-3)"
              : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: (isLoading || (!inputText.trim() && !transcript.trim())) ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            flexShrink: 0,
            boxShadow: (isLoading || (!inputText.trim() && !transcript.trim()))
              ? "none"
              : "0 2px 12px rgba(34,211,238,0.3)",
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
