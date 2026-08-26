import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar.jsx";
import NavRail from "./NavRail.jsx";
import SettingsDrawer from "./SettingsDrawer.jsx";

export default function Layout() {
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    </div>
  );
}
