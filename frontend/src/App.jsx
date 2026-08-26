import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { OrcaProvider } from "./divisions/context/OrcaContext.jsx";
import Layout from "./divisions/shell/Layout.jsx";
import Home from "./divisions/pages/Home.jsx";
import Analytics from "./divisions/pages/Analytics.jsx";
import Alerts from "./divisions/pages/Alerts.jsx";

export default function App() {
  return (
    <OrcaProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </OrcaProvider>
  );
}
