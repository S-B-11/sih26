import React, { useState } from "react";
import { Layers, ShieldAlert, Navigation, Radio, Fish, Eye, EyeOff } from "lucide-react";

export function MapLegend({ layerVisibility, onToggleLayer }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-[1000] glass-panel rounded-xl p-3 max-w-xs text-xs border border-cyan-500/30 shadow-2xl">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Map Overlays & Legend
          </span>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono">
          {isOpen ? "Hide" : "Show"}
        </span>
      </div>

      {isOpen && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-2">
          {/* PFZ Layer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-400 flex items-center justify-center text-[9px]">
                🐟
              </span>
              <span className="text-slate-300 font-medium">Potential Fishing Zone (PFZ)</span>
            </div>
            <button
              onClick={() => onToggleLayer("pfz")}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {layerVisibility.pfz ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>

          {/* Weather Hazards Layer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-red-500/40 border border-red-400 flex items-center justify-center text-[9px]">
                ⚠️
              </span>
              <span className="text-slate-300 font-medium">Weather Hazards & Cyclones</span>
            </div>
            <button
              onClick={() => onToggleLayer("hazard")}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {layerVisibility.hazard ? <Eye className="w-3.5 h-3.5 text-red-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>

          {/* Safe Route Layer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-0.5 bg-cyan-400 rounded"></span>
              <span className="text-slate-300 font-medium">A* Safe Vessel Route</span>
            </div>
            <button
              onClick={() => onToggleLayer("route")}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {layerVisibility.route ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>

          {/* Buoy Telemetries */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-cyan-300"></span>
              <span className="text-slate-300 font-medium">INCOIS Ocean Buoy Stations</span>
            </div>
            <button
              onClick={() => onToggleLayer("buoy")}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {layerVisibility.buoy ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>

          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>INCOIS Live GeoJSON Feed</span>
            <span className="text-emerald-400 font-bold">● Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
