import React from "react";
import { LANGUAGES } from "../data/presetQueries";
import { Waves, Globe, RotateCcw, History, Radio, Map, MessageSquare, Anchor } from "lucide-react";

export function Navbar({
  selectedLanguage,
  onSelectLanguage,
  onResetSession,
  onToggleHistory,
  activeTab,
  onTabChange
}) {
  return (
    <header className="w-full glass-panel sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between border-b border-cyan-500/20">
      {/* Left: Branding & ISRO/INCOIS Co-Badge */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-900 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
          <Waves className="w-6 h-6 text-cyan-300 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950">
            ISRO
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-300">
              ORCA
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded-full tracking-wide">
              SIH26176 • ISRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            Marine EcoSystem Reasoning with Collaborative Agents
          </p>
        </div>
      </div>

      {/* Middle: Satellite & Telemetry Telemetry Status Pill (Desktop) */}
      <div className="hidden lg:flex items-center space-x-3 px-3 py-1 rounded-full glass-pill text-xs text-slate-300 border border-teal-500/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-cyan-300">Oceansat-3</span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-teal-300">INSAT-3DR</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 text-[11px]">INCOIS OSF Synced</span>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="flex md:hidden items-center bg-slate-900/90 rounded-lg p-1 border border-cyan-500/30">
        <button
          onClick={() => onTabChange("chat")}
          className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md font-medium transition-all ${
            activeTab === "chat"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => onTabChange("map")}
          className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md font-medium transition-all ${
            activeTab === "map"
              ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>
      </div>

      {/* Right Controls: Multilingual Selector & Actions */}
      <div className="flex items-center space-x-2">
        {/* Language Selector */}
        <div className="relative flex items-center">
          <Globe className="w-4 h-4 text-cyan-400 absolute left-2.5 pointer-events-none" />
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-900/80 text-xs font-medium text-slate-200 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                {lang.flag} {lang.native} ({lang.label})
              </option>
            ))}
          </select>
        </div>

        {/* Reset Session */}
        <button
          onClick={onResetSession}
          title="Reset Conversation Session"
          className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* History Drawer Toggle */}
        <button
          onClick={onToggleHistory}
          title="Query Session History"
          className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all hidden sm:block"
        >
          <History className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
