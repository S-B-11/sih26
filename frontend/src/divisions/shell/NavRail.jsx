import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart2, AlertTriangle, Settings } from "lucide-react";
import { useOrca } from "../context/OrcaContext.jsx";

export default function NavRail({ onOpenSettings }) {
  const { t } = useOrca();

  const NAV_ITEMS = [
    { to: "/",          icon: Home,          labelKey: "navHome"      },
    { to: "/analytics", icon: BarChart2,      labelKey: "navAnalytics" },
    { to: "/alerts",    icon: AlertTriangle,  labelKey: "navAlerts"    },
  ];

  return (
    <nav style={{
      width: "var(--nav-w)",
      height: "100%",
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 0",
      gap: 4,
      flexShrink: 0,
      zIndex: 40,
    }}>
      {NAV_ITEMS.map(({ to, icon: Icon, labelKey }) => {
        const label = t(labelKey);
        return (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={label}
            style={({ isActive }) => ({
              width: 40,
              height: 40,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isActive ? "var(--accent)" : "var(--text-3)",
              background: isActive ? "var(--accent-dim)" : "transparent",
              border: isActive ? "1px solid var(--accent-mid)" : "1px solid transparent",
              transition: "all 0.15s ease",
              textDecoration: "none",
              cursor: "pointer",
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes("accent-dim")) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "var(--text)";
              }
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute("aria-current") === "page";
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-3)";
              }
            }}
          >
            <Icon size={18} strokeWidth={1.75} />
          </NavLink>
        );
      })}

      {/* Settings — pushed to bottom */}
      <div style={{ flex: 1 }} />
      <button
        title={t("navSettings")}
        onClick={onOpenSettings}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-3)",
          background: "transparent",
          border: "1px solid transparent",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "var(--text)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-3)";
        }}
      >
        <Settings size={18} strokeWidth={1.75} />
      </button>
    </nav>
  );
}
