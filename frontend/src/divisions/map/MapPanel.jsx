import React, { useState, useEffect } from "react";
import {
  MapContainer, TileLayer, GeoJSON,
  Marker, Popup, Polyline, useMap
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

export function MapPanel({ geojson, chatOpen }) {
  const { t } = useOrca();

  const LAYER_DEFS = [
    { key: "pfz",      labelKey: "layerPfz",    color: "#22d3ee" },
    { key: "hazard",   labelKey: "layerHazard", color: "#f87171" },
    { key: "route",    labelKey: "layerRoute",  color: "#22d3ee" },
    { key: "buoy",     labelKey: "layerBuoy",   color: "#a78bfa" },
    { key: "eez",      labelKey: "layerEez",    color: "#38bdf8" },
    { key: "mpa",      labelKey: "layerMpa",    color: "#4ade80" },
  ];

  const [layerVis, setLayerVis] = useState({
    pfz: true,
    hazard: true,
    route: true,
    buoy: true,
    eez: true,
    mpa: true
  });
  const [layersOpen, setLayersOpen] = useState(false);

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
              width: 230,
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {t("mapLayers")}
              </span>
              <button onClick={() => setLayersOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}>
                <X size={13} />
              </button>
            </div>

            {LAYER_DEFS.map(({ key, labelKey, color }) => (
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
                <span style={{ flex: 1, fontSize: 11.5, color: layerVis[key] ? "var(--text)" : "var(--text-3)" }}>{t(labelKey)}</span>
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
          title={t("mapLayers")}
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
        center={[18.5, 78.5]}
        zoom={6}
        scrollWheelZoom
        zoomControl
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> · ISRO INCOIS'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MapSizer chatOpen={chatOpen} />
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
                        <Row label={t("sst")} value={prop.sst} accent />
                        <Row label={t("chlorophyll")} value={prop.chlorophyll} accent />
                        <Row label={t("species")} value={prop.species} />
                        {prop.advisory && <div style={{ marginTop: 4, color: "var(--accent)", fontSize: 10 }}>{prop.advisory}</div>}
                      </div>
                    )}
                    {prop.type === "hazard" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11 }}>
                        <Row label="Risk" value={prop.riskLevel} danger />
                        {prop.sst && <Row label={t("sst")} value={prop.sst} />}
                        {prop.chlorophyll && <Row label={t("chlorophyll")} value={prop.chlorophyll} />}
                        {prop.waveHeight && <Row label={t("waveHeight")} value={prop.waveHeight} />}
                        {prop.windSpeed && <Row label={t("windSpeed")} value={prop.windSpeed} />}
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
                      <Row label={t("sst")} value={prop.sst} accent />
                      <Row label={t("waveHeight")} value={prop.waveHeight} />
                      <Row label={t("windSpeed")} value={prop.windSpeed} />
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
                    <Row label={t("distance")} value={prop.distance} accent />
                    <Row label={t("estTime")} value={prop.estimatedTime} />
                    <Row label={t("safetyScore")} value={prop.safetyScore} accent />
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
