import React, { createContext, useContext, useEffect, useState } from "react";
import { useOrcaQuery } from "../hooks/useOrcaQuery.js";

const OrcaContext = createContext(null);
const THEME_STORAGE_KEY = "orca-theme";

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return ["light", "dark", "system"].includes(savedTheme) ? savedTheme : "system";
}

export function OrcaProvider({ children }) {
  const orca = useOrcaQuery();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolvedTheme = theme === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : theme;
      root.dataset.theme = resolvedTheme;
      root.style.colorScheme = resolvedTheme;
    };
    const handleSystemThemeChange = () => {
      if (theme === "system") applyTheme();
    };

    applyTheme();
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  return <OrcaContext.Provider value={{ ...orca, theme, setTheme }}>{children}</OrcaContext.Provider>;
}

export function useOrca() {
  const ctx = useContext(OrcaContext);
  if (!ctx) throw new Error("useOrca must be used inside <OrcaProvider>");
  return ctx;
}
