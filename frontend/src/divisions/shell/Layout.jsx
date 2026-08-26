import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useOrca } from "../context/OrcaContext.jsx";
import TopBar from "./TopBar.jsx";
import NavRail from "./NavRail.jsx";
import SettingsDrawer from "./SettingsDrawer.jsx";
import LanguageModal from "./LanguageModal.jsx";

export default function Layout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isLanguageModalOpen, setIsLanguageModalOpen, selectedLanguage, setSelectedLanguage } = useOrca();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)" }}>
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <NavRail onOpenSettings={() => setSettingsOpen(true)} />

        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <Outlet />
        </main>
      </div>

      <SettingsDrawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />
    </div>
  );
}
