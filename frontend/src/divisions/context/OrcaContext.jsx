import React, { createContext, useContext } from "react";
import { useOrcaQuery } from "../hooks/useOrcaQuery.js";

const OrcaContext = createContext(null);

export function OrcaProvider({ children }) {
  const orca = useOrcaQuery();
  return <OrcaContext.Provider value={orca}>{children}</OrcaContext.Provider>;
}

export function useOrca() {
  const ctx = useContext(OrcaContext);
  if (!ctx) throw new Error("useOrca must be used inside <OrcaProvider>");
  return ctx;
}
