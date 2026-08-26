import React, { useState, useEffect } from "react";
import {
  MapContainer, TileLayer, GeoJSON,
  Marker, Popup, Polyline, ScaleControl, useMap
} from "react-leaflet";
import L from "leaflet";
import { Layers, Navigation, X, ShieldAlert } from "lucide-react";
import { GEOFENCE_ZONES } from "../data/geofenceZones.js";
import { useOrca } from "../context/OrcaContext.jsx";

// Fix Leaflet icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const buoyIcon = L.divIcon({
  className: "",
  html: `<div style="
    background: radial-gradient(circle, #22d3ee 0%, #0891b2 100%);
    width:16px;height:16px;border-radius:50%;
    border:2px solid rgba(255,255,255,0.6);
    box-shadow:0 0 12px rgba(34,211,238,0.8);
    position:relative;">
    <div style="
      position:absolute;top:-3px;left:-3px;
      width:22px;height:22px;border-radius:50%;
      border:1.5px solid rgba(34,211,238,0.5);
      animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;">
    </div>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Recenter map when geojson changes
function MapRecenter({ geojson }) {
  const map = useMap();
  useEffect(() => {
    if (!geojson?.features?.length) return;
    try {
      const bounds = L.geoJSON(geojson).getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 11, animate: true });
    } catch {}
  }, [geojson, map]);
  return null;
}

// Invalidate map size when chat panel opens/closes
function MapSizer({ chatOpen }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 360);
    return () => clearTimeout(t);
  }, [chatOpen, map]);
  return null;
}

// Keep the viewport inside the tile world's valid north/south range.
function MapWorldBounds() {
  const map = useMap();

  useEffect(() => {
    const clampLatitude = () => {
      const center = map.getCenter();
      const latitude = Math.max(-85, Math.min(85, center.lat));
      if (latitude !== center.lat) {
        map.panTo([latitude, center.lng], { animate: false });
      }
    };

    map.on("move", clampLatitude);
    return () => map.off("move", clampLatitude);
  }, [map]);

  return null;
}

const LAYER_DEFS = [
  { key: "pfz",      label: "PFZ Zones",             color: "#22d3ee" },
  { key: "hazard",   label: "Hazard & Weather",      color: "#f87171" },
  { key: "route",    label: "Safe Routes",           color: "#22d3ee" },
  { key: "buoy",     label: "Buoy Stations",         color: "#a78bfa" },
  { key: "eez",      label: "EEZ Boundary (200NM)",  color: "#38bdf8" },
  { key: "mpa",      label: "Marine Protected Areas", color: "#4ade80" },
];

export function MapPanel({ geojson, chatOpen }) {
  const { theme } = useOrca();
  const [layerVis, setLayerVis] = useState({
    pfz: true,
    hazard: true,
    route: true,
    buoy: true,
    eez: true,
    mpa: true
  });
  const [layersOpen, setLayersOpen] = useState(false);
  const isDarkMap = theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleLayer = (k) => setLayerVis(p => ({ ...p, [k]: !p[k] }));

  const getStyle = (feature) => {
    const t = feature.properties?.type || feature.properties?.zoneType;
    if (t === "pfz")        return { fillColor: "#22d3ee", color: "#22d3ee", weight: 1.5, dashArray: "5 4", fillOpacity: 0.25, opacity: 0.7 };
    if (t === "hazard")     return { fillColor: feature.properties?.riskLevel === "HIGH" ? "#f87171" : "#fbbf24", color: "#f87171", weight: 2, fillOpacity: 0.3, opacity: 0.9 };
    if (t === "restricted") return { fillColor: "#dc2626", color: "#991b1b", weight: 1.5, dashArray: "6 4", fillOpacity: 0.4, opacity: 0.8 };
    if (t === "eez")        return { fillColor: "#0284c7", color: "#38bdf8", weight: 1.8, dashArray: "8 6", fillOpacity: 0.04, opacity: 0.8 };
    if (t === "mpa" || t === "esz") return { fillColor: "#10b981", color: "#4ade80", weight: 1.8, dashArray: "4 4", fillOpacity: 0.22, opacity: 0.9 };
    if (t === "imbl")       return { fillColor: "#b91c1c", color: "#ef4444", weight: 2.2, dashArray: "6 4", fillOpacity: 0.3, opacity: 0.95 };
    return { fillColor: "#6366f1", color: "#818cf8", weight: 1.5, fillOpacity: 0.2 };
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "var(--bg)" }}>

      {/* Layers toggle button — bottom-left corner */}
      <div style={{ position: "absolute", bottom: 20, left: 16, zIndex: 1000 }}>

        {/* Layers popover */}
        {layersOpen && (
          <div
            className="fade-up"
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: 0,
              width: 220,
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Map Layers
              </span>
              <button onClick={() => setLayersOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}>
                <X size={13} />
              </button>
            </div>

            {LAYER_DEFS.map(({ key, label, color }) => (
              <label key={key} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 0",
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: layerVis[key] ? `${color}1a` : "var(--surface-2)",
                  border: `1px solid ${layerVis[key] ? color + "44" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: layerVis[key] ? color : "var(--text-3)" }} />
                </span>
                <span style={{ flex: 1, fontSize: 11.5, color: layerVis[key] ? "var(--text)" : "var(--text-3)" }}>{label}</span>
                <input
                  type="checkbox"
                  checked={layerVis[key]}
                  onChange={() => toggleLayer(key)}
                  style={{ display: "none" }}
                />
              </label>
            ))}
          </div>
        )}

        {/* Layers button */}
        <button
          onClick={() => setLayersOpen(o => !o)}
          title="Map Layers & Geofences"
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: layersOpen ? "var(--accent-dim)" : "var(--surface)",
            border: `1px solid ${layersOpen ? "var(--accent-mid)" : "var(--border-2)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: layersOpen ? "var(--accent)" : "var(--text-2)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            transition: "all 0.15s ease",
          }}
        >
          <Layers size={16} />
        </button>
      </div>

      {/* Leaflet map */}
      <MapContainer
        center={[20.5, 78.5]}
        zoom={4}
        minZoom={2}
        scrollWheelZoom
        zoomControl
        worldCopyJump
        zoomAnimation
        fadeAnimation
        markerZoomAnimation
        preferCanvas
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> · ISRO INCOIS'
          url={isDarkMap
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
          maxZoom={19}
          maxNativeZoom={19}
          updateWhenZooming={false}
          updateWhenIdle
        />
        <ScaleControl position="bottomright" metric maxWidth={160} />

        <MapSizer chatOpen={chatOpen} />
        <MapWorldBounds />
        {geojson && <MapRecenter geojson={geojson} />}

        {/* ── Geofence boundaries (EEZ, MPAs, Restricted Waters) ───────────── */}
        {GEOFENCE_ZONES.map((zone) => {
          const zType = zone.properties.zoneType;
          const showZone = (zType === "eez" && layerVis.eez) ||
                           ((zType === "mpa" || zType === "esz" || zType === "restricted" || zType === "imbl") && layerVis.mpa);

          if (!showZone) return null;

          return (
            <GeoJSON key={`geofence-${zone.id}`} data={zone} style={getStyle(zone)}>
              <Popup>
                <div style={{ padding: "3px 0", minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 12, color: zone.properties.color }}>
                    <ShieldAlert size={13} /> {zone.properties.name}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "var(--text)", lineHeight: 1.4 }}>
                    {zone.properties.message}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-3)" }}>
                    Authority: {zone.properties.authority}
                  </div>
                </div>
              </Popup>
            </GeoJSON>
          );
        })}

        {/* ── Dynamic Scenario Layers ─────────────────────────────────────── */}
        {geojson?.features?.map((feat, idx) => {
          const prop = feat.properties || {};
          const geomType = feat.geometry?.type;

          if ((geomType === "Polygon" || geomType === "MultiPolygon") &&
              ((prop.type === "pfz" && layerVis.pfz) ||
               (prop.type === "hazard" && layerVis.hazard) ||
               prop.type === "restricted")) {
            return (
              <GeoJSON key={`poly-${feat.id || idx}`} data={feat} style={getStyle(feat)}>
                <Popup>
                  <div style={{ padding: "2px 0", minWidth: 180 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12 }}>{prop.name}</div>
                    {prop.type === "pfz" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11 }}>
                        <Row label="SST" value={prop.sst} accent />
                        <Row label="Chlorophyll-a" value={prop.chlorophyll} accent />
                        <Row label="Species" value={prop.species} />
                        {prop.advisory && <div style={{ marginTop: 4, color: "var(--accent)", fontSize: 10 }}>{prop.advisory}</div>}
                      </div>
                    )}
                    {prop.type === "hazard" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11 }}>
                        <Row label="Risk" value={prop.riskLevel} danger />
                        {prop.sst && <Row label="SST" value={prop.sst} />}
                        {prop.chlorophyll && <Row label="Chlorophyll" value={prop.chlorophyll} />}
                        {prop.waveHeight && <Row label="Wave Height" value={prop.waveHeight} />}
                        {prop.windSpeed && <Row label="Wind Speed" value={prop.windSpeed} />}
                        {prop.warningText && <div style={{ marginTop: 4, color: "var(--danger)", fontSize: 10 }}>{prop.warningText}</div>}
                      </div>
                    )}
                  </div>
                </Popup>
              </GeoJSON>
            );
          }

          if (geomType === "Point" && prop.type === "buoy" && layerVis.buoy) {
            const [lng, lat] = feat.geometry.coordinates;
            return (
              <Marker key={`buoy-${feat.id || idx}`} position={[lat, lng]} icon={buoyIcon}>
                <Popup>
                  <div style={{ padding: "2px 0", minWidth: 180 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12, color: "#22d3ee" }}>{prop.name}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11 }}>
                      <Row label="SST" value={prop.sst} accent />
                      <Row label="Wave Height" value={prop.waveHeight} />
                      <Row label="Wind" value={prop.windSpeed} />
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }

          if (geomType === "LineString" && prop.type === "route" && layerVis.route) {
            const latlngs = feat.geometry.coordinates.map(c => [c[1], c[0]]);
            return (
              <Polyline
                key={`route-${feat.id || idx}`}
                positions={latlngs}
                pathOptions={{ color: "#22d3ee", weight: 3, opacity: 0.85, dashArray: "10 8", className: "animated-route-path" }}
              >
                <Popup>
                  <div style={{ padding: "2px 0", fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 6, color: "#22d3ee" }}>
                      <Navigation size={12} /> {prop.name}
                    </div>
                    <Row label="Distance" value={prop.distance} accent />
                    <Row label="Est. Time" value={prop.estimatedTime} />
                    <Row label="Safety" value={prop.safetyScore} accent />
                  </div>
                </Popup>
              </Polyline>
            );
          }

          return null;
        })}
      </MapContainer>
    </div>
  );
}

function Row({ label, value, accent, danger }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "var(--text-3)" }}>{label}</span>
      <span style={{
        fontWeight: 500,
        color: danger ? "var(--danger)" : accent ? "var(--accent)" : "var(--text)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      }}>{value}</span>
    </div>
  );
}
