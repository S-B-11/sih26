"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Circle, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-velocity/dist/leaflet-velocity.css";

// leaflet-velocity (github.com/onaci/leaflet-velocity) is a plain script
// that attaches L.velocityLayer onto a *global* `L`, rather than an ES
// module that exports it — so it has to run after `window.L` exists, and
// only in the browser. This file is only ever loaded client-side (it's
// imported via next/dynamic with ssr:false in page.tsx), so it's safe to
// do that wiring here at module scope instead of inside an effect.
if (typeof window !== "undefined") {
  (window as unknown as { L: typeof L }).L = L;
  // leaflet-velocity is a plain script with no ESM export; it must run
  // synchronously after window.L is set, which a dynamic import() can't
  // guarantee before use.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet-velocity");
}

export type MapZone = {
  name: string;
  type: string;
  min_lat: number;
  max_lat: number;
  min_lon: number;
  max_lon: number;
};

export type MapWaypoint = {
  sequence: number;
  latitude: number;
  longitude: number;
  role: string;
  wave_height_m: number | null;
};

export type MarineMapProps = {
  center: { lat: number; lon: number; name: string };
  activeLayer: "pfz" | "thermal" | "wind" | "geofence" | "bathymetry";
  language?: string;
  marine?: { sst?: number | null; waveHeight?: number | null };
  weather?: { windSpeed?: number | null; windDeg?: number | null; windDir?: string | null };
  pfz?: {
    nearestZone: {
      latitude: number;
      longitude: number;
      distance_km: number;
      bearing_compass: string;
      confidence: string;
    };
    candidates: Array<{
      latitude: number;
      longitude: number;
      distance_km: number;
      sea_surface_temperature: number;
      score: number;
    }>;
  } | null;
  geo?: {
    restrictedZone?: MapZone | null;
    mpaZone?: MapZone | null;
    geofenceTriggered?: boolean;
    geofenceDistanceKm?: number | null;
  };
  route?: {
    waypoints: MapWaypoint[];
    hazardsAvoided: Array<{ name: string; type: string }>;
  } | null;
};

// Popup/label copy for the map's own layers (PFZ, thermal, geofence,
// route) — separate from page.tsx's UI chrome dictionaries since this
// component is used from two different places in that file but only
// needs this one small slice of strings.
const MAP_COPY: Record<string, Record<string, string>> = {
  en: {
    sstLabel: "Sea Surface Temperature: {sst}°C",
    pfzScore: "Productivity score: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "~{distance} km from your position",
    pfzNearestTitle: "Nearest Potential Fishing Zone",
    pfzOfPosition: "~{distance} km {bearing} of your position",
    pfzConfidence: "Confidence: {confidence}",
    geofenceBuffer: "Operational geofence proximity buffer",
    routeWave: "wave {wave}m",
    roleOrigin: "Origin",
    roleDestination: "Destination",
    roleBypass: "Bypass (avoiding hazard)",
    roleWaypoint: "Waypoint",
    windLabel: "Wind",
    directionLabel: "Direction",
    speedLabel: "Speed",
    noWindData: "No wind data",
  },
  hi: {
    sstLabel: "समुद्र सतह तापमान: {sst}°C",
    pfzScore: "उत्पादकता स्कोर: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "आपकी स्थिति से ~{distance} किमी",
    pfzNearestTitle: "निकटतम संभावित मत्स्य क्षेत्र",
    pfzOfPosition: "आपकी स्थिति से ~{distance} किमी {bearing} दिशा में",
    pfzConfidence: "विश्वसनीयता: {confidence}",
    geofenceBuffer: "परिचालन जियोफेंस निकटता बफर",
    routeWave: "लहर {wave}मी",
    roleOrigin: "प्रारंभिक बिंदु",
    roleDestination: "गंतव्य",
    roleBypass: "बायपास (खतरे से बचाव)",
    roleWaypoint: "वेपॉइंट",
    windLabel: "हवा",
    directionLabel: "दिशा",
    speedLabel: "गति",
    noWindData: "हवा डेटा उपलब्ध नहीं",
  },
  ta: {
    sstLabel: "கடல் மேற்பரப்பு வெப்பநிலை: {sst}°C",
    pfzScore: "உற்பத்தித் திறன் மதிப்பெண்: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "உங்கள் இருப்பிடத்திலிருந்து ~{distance} கிமீ",
    pfzNearestTitle: "அருகிலுள்ள சாத்தியமான மீன்பிடி மண்டலம்",
    pfzOfPosition: "உங்கள் இருப்பிடத்திலிருந்து ~{distance} கிமீ {bearing} திசையில்",
    pfzConfidence: "நம்பகத்தன்மை: {confidence}",
    geofenceBuffer: "செயல்பாட்டு ஜியோஃபென்ஸ் அருகாமை இடையகம்",
    routeWave: "அலை {wave}மீ",
    roleOrigin: "தொடக்கம்",
    roleDestination: "இலக்கு",
    roleBypass: "தவிர்ப்பு (ஆபத்தை தவிர்த்தல்)",
    roleWaypoint: "வழிப்புள்ளி",
    windLabel: "காற்று",
    directionLabel: "திசை",
    speedLabel: "வேகம்",
    noWindData: "காற்று தரவு இல்லை",
  },
  te: {
    sstLabel: "సముద్ర ఉపరితల ఉష్ణోగ్రత: {sst}°C",
    pfzScore: "ఉత్పాదకత స్కోరు: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "మీ స్థానం నుండి ~{distance} కి.మీ",
    pfzNearestTitle: "సమీప సంభావ్య మత్స్య మండలం",
    pfzOfPosition: "మీ స్థానం నుండి ~{distance} కి.మీ {bearing} దిశలో",
    pfzConfidence: "విశ్వసనీయత: {confidence}",
    geofenceBuffer: "కార్యాచరణ జియోఫెన్స్ సామీప్య బఫర్",
    routeWave: "అల {wave}మీ",
    roleOrigin: "ప్రారంభం",
    roleDestination: "గమ్యం",
    roleBypass: "బైపాస్ (ప్రమాదాన్ని నివారించడం)",
    roleWaypoint: "మార్గ బిందువు",
    windLabel: "గాలి",
    directionLabel: "దిశ",
    speedLabel: "వేగం",
    noWindData: "గాలి డేటా లేదు",
  },
  ml: {
    sstLabel: "സമുദ്ര ഉപരിതല താപനില: {sst}°C",
    pfzScore: "ഉൽപാദനക്ഷമത സ്കോർ: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "നിങ്ങളുടെ സ്ഥാനത്ത് നിന്ന് ~{distance} കി.മീ",
    pfzNearestTitle: "അടുത്തുള്ള സാധ്യതയുള്ള മത്സ്യബന്ധന മേഖല",
    pfzOfPosition: "നിങ്ങളുടെ സ്ഥാനത്ത് നിന്ന് ~{distance} കി.മീ {bearing} ദിശയിൽ",
    pfzConfidence: "വിശ്വാസ്യത: {confidence}",
    geofenceBuffer: "പ്രവർത്തന ജിയോഫെൻസ് സാമീപ്യ ബഫർ",
    routeWave: "തിരമാല {wave}മീ",
    roleOrigin: "ആരംഭം",
    roleDestination: "ലക്ഷ്യസ്ഥാനം",
    roleBypass: "ബൈപാസ് (അപകടം ഒഴിവാക്കൽ)",
    roleWaypoint: "വേപോയിന്റ്",
    windLabel: "കാറ്റ്",
    directionLabel: "ദിശ",
    speedLabel: "വേഗത",
    noWindData: "കാറ്റ് ഡാറ്റ ലഭ്യമല്ല",
  },
  bn: {
    sstLabel: "সমুদ্রপৃষ্ঠের তাপমাত্রা: {sst}°C",
    pfzScore: "উৎপাদনশীলতা স্কোর: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "আপনার অবস্থান থেকে ~{distance} কিমি",
    pfzNearestTitle: "নিকটতম সম্ভাব্য মৎস্য অঞ্চল",
    pfzOfPosition: "আপনার অবস্থান থেকে ~{distance} কিমি {bearing} দিকে",
    pfzConfidence: "নির্ভরযোগ্যতা: {confidence}",
    geofenceBuffer: "পরিচালন জিওফেন্স নৈকট্য বাফার",
    routeWave: "ঢেউ {wave}মি",
    roleOrigin: "শুরু",
    roleDestination: "গন্তব্য",
    roleBypass: "বাইপাস (বিপদ এড়ানো)",
    roleWaypoint: "ওয়েপয়েন্ট",
    windLabel: "বাতাস",
    directionLabel: "দিক",
    speedLabel: "গতি",
    noWindData: "বাতাসের তথ্য নেই",
  },
  gu: {
    sstLabel: "સમુદ્ર સપાટીનું તાપમાન: {sst}°C",
    pfzScore: "ઉત્પાદકતા સ્કોર: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "તમારા સ્થાનથી ~{distance} કિમી",
    pfzNearestTitle: "નજીકનું સંભવિત મત્સ્ય ક્ષેત્ર",
    pfzOfPosition: "તમારા સ્થાનથી ~{distance} કિમી {bearing} દિશામાં",
    pfzConfidence: "વિશ્વસનીયતા: {confidence}",
    geofenceBuffer: "પરિચાલન જિયોફેન્સ સામીપ્ય બફર",
    routeWave: "મોજું {wave}મી",
    roleOrigin: "શરૂઆત",
    roleDestination: "ગંતવ્ય",
    roleBypass: "બાયપાસ (જોખમ ટાળવું)",
    roleWaypoint: "વેપોઇન્ટ",
    windLabel: "પવન",
    directionLabel: "દિશા",
    speedLabel: "ઝડપ",
    noWindData: "પવન ડેટા ઉપલબ્ધ નથી",
  },
  mr: {
    sstLabel: "समुद्र पृष्ठभागाचे तापमान: {sst}°C",
    pfzScore: "उत्पादकता गुण: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "तुमच्या स्थानापासून ~{distance} किमी",
    pfzNearestTitle: "सर्वात जवळचे संभाव्य मासेमारी क्षेत्र",
    pfzOfPosition: "तुमच्या स्थानापासून ~{distance} किमी {bearing} दिशेला",
    pfzConfidence: "विश्वासार्हता: {confidence}",
    geofenceBuffer: "कार्यान्वयन जिओफेन्स समीपता बफर",
    routeWave: "लाट {wave}मी",
    roleOrigin: "सुरुवात",
    roleDestination: "गंतव्य",
    roleBypass: "बायपास (धोका टाळणे)",
    roleWaypoint: "वेपॉइंट",
    windLabel: "वारा",
    directionLabel: "दिशा",
    speedLabel: "वेग",
    noWindData: "वाऱ्याचा डेटा उपलब्ध नाही",
  },
};

function mt(language: string | undefined, key: string, vars: Record<string, string | number> = {}) {
  const template = MAP_COPY[language ?? "en"]?.[key] ?? MAP_COPY.en[key] ?? key;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    template
  );
}

// Leaflet's default marker icon references image files by relative URL,
// which breaks under Next.js's bundler — divIcon with inline markup
// sidesteps that entirely and matches the app's existing emoji-style
// marker look (⚓ for the vessel, 🐟 for PFZ, etc.) instead of Leaflet's
// generic pin. A colour-matched glow ring (box-shadow, not filter — cheaper
// to composite for a canvas-heavy map) reads as more deliberate than a flat
// dot, and an optional CSS pulse (reusing the app's existing
// .animate-ping-subtle keyframe) calls out the vessel/zone markers the way
// the old decorative radar mock-up did, but now on a real map.
function markerIcon(emoji: string, background: string, size = 30, pulse = false) {
  const ring = pulse
    ? `<span class="animate-ping-subtle" style="position:absolute;inset:-6px;border-radius:9999px;background:${background};opacity:0.35;"></span>`
    : "";
  // The animation goes on this inner div, not the outer wrapper Leaflet
  // returns as the icon element — Leaflet positions markers with its own
  // `transform: translate3d(...)` inline style on that outer element, and
  // a CSS animation touching `transform` there would fight it and the
  // marker would render in the wrong place.
  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${ring}
        <div class="orca-map-marker-in" style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:9999px;background:${background};border:2.5px solid white;box-shadow:0 0 0 4px ${background}26, 0 4px 10px rgba(0,0,0,0.45);font-size:${Math.round(size * 0.5)}px;">${emoji}</div>
      </div>
    `,
    className: "orca-map-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const vesselIcon = markerIcon("⚓", "#0ea5e9", 32, true);
const pfzIcon = markerIcon("🐟", "#059669", 30, true);
const geofenceIcon = markerIcon("🛡️", "#d97706");
const waypointIcon = markerIcon("•", "#64748b", 18);

// SST comfort band consistent with the risk/synthesis agents' thresholds:
// cool water below it, favourable pelagic range in the middle, warm above.
function sstColor(sst: number) {
  if (sst < 24) return "#0ea5e9";
  if (sst <= 30.5) return "#22c55e";
  return "#f97316";
}

function confidenceRadiusM(confidence: string) {
  if (confidence === "HIGH") return 6000;
  if (confidence === "LOW") return 16000;
  return 10000;
}

// Score is roughly 0-100 (SST band + thermal-front gradient + chlorophyll
// bonus from pfz_agent) — green reads as a strong productivity signal,
// amber moderate, slate weak, so the whole grid reads like a heat layer
// instead of one isolated pin with no context for why it won.
function pfzScoreColor(score: number) {
  if (score >= 65) return "#16a34a";
  if (score >= 45) return "#eab308";
  return "#64748b";
}

// Tracks the app's theme-light toggle (a class on <html>, flipped in
// page.tsx) so the basemap can switch between a CartoDB dark and light
// style instead of the app staying dark-themed but the map staying a
// jarring plain-white OSM sheet, or vice versa.
function useIsLightTheme() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsLight(root.classList.contains("theme-light"));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

// A distance scale bar reads as basic cartographic due-diligence on any
// professional map — Leaflet ships one, but only as an imperative control,
// not a react-leaflet component.
function ScaleControl() {
  const map = useMap();

  useEffect(() => {
    const control = L.control.scale({ metric: true, imperial: false, position: "bottomleft" });
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}

// react-leaflet only reads `center`/`zoom` on first mount — re-panning
// when the resolved location changes (new query, carried-forward
// location, etc.) needs an explicit `setView` via the map instance.
function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);

  return null;
}

// The full static MPA/restricted-zone list (not just whichever one the
// current query happens to sit inside) so the geofence layer gives real
// situational awareness — "what's nearby" — instead of only lighting up
// when you're already inside a zone.
function useAllZones() {
  const [zones, setZones] = useState<{ mpa: MapZone[]; restricted: MapZone[] }>({ mpa: [], restricted: [] });

  useEffect(() => {
    let cancelled = false;

    fetch("http://localhost:8000/api/zones")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.success) return;
        setZones({
          mpa: data.marine_protected_areas ?? [],
          restricted: data.restricted_zones ?? [],
        });
      })
      .catch(() => {
        // Geofence layer just shows the currently-detected zone (if any)
        // instead of the full list — not worth surfacing a fetch error for.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return zones;
}

type WindGridLayer = {
  header: Record<string, number | string>;
  data: number[];
};

// Live u/v wind-component grid around the current map center, fetched
// only while the wind layer is actually selected (it's a ~64-point
// batched request — no point paying for it on other layers).
function useWindGrid(active: boolean, lat: number, lon: number) {
  const [grid, setGrid] = useState<WindGridLayer[] | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    fetch(`http://localhost:8000/api/wind-grid?latitude=${lat}&longitude=${lon}&span_deg=3.0`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.success) return;
        setGrid(data.grid);
      })
      .catch(() => {
        // Falls back to no animated field — the layer still renders the
        // base map, it just won't show flow lines until this succeeds.
      });

    return () => {
      cancelled = true;
    };
  }, [active, lat, lon]);

  return grid;
}

// Renders the animated wind flow field via the leaflet-velocity plugin,
// which isn't a react-leaflet component — it attaches an imperative
// canvas layer directly to the underlying Leaflet map instance.
function WindVelocityLayer({ grid, language }: { grid: WindGridLayer[] | null; language?: string }) {
  const map = useMap();

  useEffect(() => {
    if (!grid) return;

    // @ts-expect-error - leaflet-velocity has no type declarations; it
    // extends the global L namespace at runtime (see the top-of-file
    // require()).
    const layer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: mt(language, "windLabel"),
        position: "topright",
        emptyString: mt(language, "noWindData"),
        directionString: mt(language, "directionLabel"),
        speedString: mt(language, "speedLabel"),
        angleConvention: "bearingCW",
        speedUnit: "k/h",
      },
      data: grid,
      minVelocity: 0,
      maxVelocity: 20,
      velocityScale: 0.012,
      colorScale: ["#22d3ee", "#38bdf8", "#a3e635", "#facc15", "#f97316", "#ef4444"],
    });

    layer.addTo(map);

    return () => {
      // Next.js dev-mode Fast Refresh can remount this component while
      // the plugin's own internal animation frame / timers are still
      // in flight; the plugin's teardown then reaches into a Leaflet
      // map instance that's already been torn down and throws. Since
      // this only happens mid hot-reload (not in a built app) and the
      // layer is being discarded either way, swallow it rather than
      // let it crash the console.
      try {
        // @ts-expect-error - Leaflet's internal "is this map still live"
        // flag isn't part of its public types.
        if (map._loaded) {
          map.removeLayer(layer);
        }
      } catch {
        // Layer/map already torn down — nothing left to clean up.
      }
    };
  }, [grid, map, language]);

  return null;
}

export default function MarineMap({ center, activeLayer, marine, pfz, geo, route, language }: MarineMapProps) {
  const restrictedZone = geo?.restrictedZone;
  const mpaZone = geo?.mpaZone;
  const allZones = useAllZones();
  const isLight = useIsLightTheme();

  const windGrid = useWindGrid(activeLayer === "wind", center.lat, center.lon);

  const isBathymetry = activeLayer === "bathymetry";

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={9}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      {isBathymetry ? (
        // Esri's public Ocean basemap — real depth-shaded bathymetric
        // tiles, no API key required. Every other layer uses standard
        // basemap tiles, which don't carry ocean-depth shading at all.
        <TileLayer
          attribution="Sources: Esri, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org, and other contributors"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        // CARTO's free basemaps (light_all/dark_all) started watermarking
        // "API KEY REQUIRED" for real browser traffic even though direct
        // fetches still returned clean tiles — the anonymous tier is no
        // longer reliable without a CARTO account. Standard OpenStreetMap
        // tiles are the one raster source with a genuinely durable no-auth
        // free policy, so use those for both themes, and fake a dark
        // basemap with a CSS invert filter (a well-worn technique) instead
        // of depending on a second tile provider for dark mode.
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className={isLight ? undefined : "orca-tile-dark"}
        />
      )}

      <ScaleControl />
      <Recenter lat={center.lat} lon={center.lon} />

      <Marker position={[center.lat, center.lon]} icon={vesselIcon}>
        <Popup>{center.name}</Popup>
      </Marker>

      {activeLayer === "thermal" && marine?.sst != null && (
        <>
          {/* Three fading rings instead of one flat circle, so the layer
              reads as a thermal gradient radiating from the reading point
              rather than a single hard-edged disc. */}
          {[1, 0.66, 0.35].map((scale, index) => (
            <Circle
              key={index}
              center={[center.lat, center.lon]}
              radius={20000 * scale}
              pathOptions={{
                color: sstColor(marine.sst as number),
                weight: index === 0 ? 1 : 0,
                fillColor: sstColor(marine.sst as number),
                fillOpacity: 0.22 - index * 0.06,
              }}
            >
              {index === 0 && <Popup>{mt(language, "sstLabel", { sst: marine.sst as number })}</Popup>}
            </Circle>
          ))}
        </>
      )}

      {activeLayer === "wind" && <WindVelocityLayer grid={windGrid} language={language} />}

      {activeLayer === "pfz" && pfz && (
        <>
          {/* Every scored grid point, not just the winner — reads as a
              productivity heat layer so the chosen zone's "why" is visible
              (nearby green points) instead of one pin with no context. */}
          {pfz.candidates.map((candidate, index) => {
            const isBest =
              candidate.latitude === pfz.nearestZone.latitude && candidate.longitude === pfz.nearestZone.longitude;
            if (isBest) return null;
            return (
              <Circle
                key={index}
                center={[candidate.latitude, candidate.longitude]}
                radius={4500}
                pathOptions={{
                  color: pfzScoreColor(candidate.score),
                  fillColor: pfzScoreColor(candidate.score),
                  fillOpacity: 0.35,
                  weight: 1,
                  opacity: 0.6,
                  className: `map-stagger-${index % 8}`,
                }}
              >
                <Popup>
                  {mt(language, "pfzScore", { score: candidate.score })}
                  <br />
                  {mt(language, "pfzSst", { sst: candidate.sea_surface_temperature })}
                  <br />
                  {mt(language, "pfzFrom", { distance: candidate.distance_km })}
                </Popup>
              </Circle>
            );
          })}

          <Circle
            center={[pfz.nearestZone.latitude, pfz.nearestZone.longitude]}
            radius={confidenceRadiusM(pfz.nearestZone.confidence)}
            pathOptions={{ color: "#059669", fillColor: "#059669", fillOpacity: 0.12, dashArray: "4 5" }}
          />
          <Marker position={[pfz.nearestZone.latitude, pfz.nearestZone.longitude]} icon={pfzIcon}>
            <Popup>
              {mt(language, "pfzNearestTitle")}
              <br />
              {mt(language, "pfzOfPosition", {
                distance: pfz.nearestZone.distance_km,
                bearing: pfz.nearestZone.bearing_compass,
              })}
              <br />
              {mt(language, "pfzConfidence", { confidence: pfz.nearestZone.confidence })}
            </Popup>
          </Marker>
        </>
      )}

      {activeLayer === "geofence" && (
        <>
          {allZones.mpa.map((zone) => {
            const isActive = zone.name === mpaZone?.name;
            return (
              <Rectangle
                key={zone.name}
                bounds={[
                  [zone.min_lat, zone.min_lon],
                  [zone.max_lat, zone.max_lon],
                ]}
                pathOptions={{
                  color: "#d97706",
                  fillColor: "#d97706",
                  fillOpacity: isActive ? 0.28 : 0.08,
                  weight: isActive ? 2 : 1,
                }}
              >
                <Popup>
                  {zone.name}
                  <br />
                  {zone.type}
                </Popup>
              </Rectangle>
            );
          })}

          {allZones.restricted.map((zone) => {
            const isActive = zone.name === restrictedZone?.name;
            return (
              <Rectangle
                key={zone.name}
                bounds={[
                  [zone.min_lat, zone.min_lon],
                  [zone.max_lat, zone.max_lon],
                ]}
                pathOptions={{
                  color: "#f43f5e",
                  fillColor: "#f43f5e",
                  fillOpacity: isActive ? 0.28 : 0.08,
                  weight: isActive ? 2 : 1,
                }}
              >
                <Popup>
                  {zone.name}
                  <br />
                  {zone.type}
                </Popup>
              </Rectangle>
            );
          })}

          {geo?.geofenceTriggered && (
            <Circle
              center={[center.lat, center.lon]}
              radius={(geo.geofenceDistanceKm ?? 25) * 1000}
              pathOptions={{ color: "#d97706", dashArray: "6 6", fillOpacity: 0 }}
            >
              <Marker position={[center.lat, center.lon]} icon={geofenceIcon}>
                <Popup>{mt(language, "geofenceBuffer")}</Popup>
              </Marker>
            </Circle>
          )}
        </>
      )}

      {route && route.waypoints.length > 1 && (
        <>
          <Polyline
            positions={route.waypoints.map((point) => [point.latitude, point.longitude])}
            pathOptions={{
              color: "#38bdf8",
              weight: 3,
              // The hazard-route dashArray ("8 6") and the draw-in reveal
              // both work by animating stroke-dasharray/-dashoffset, so
              // they can't be combined without one undoing the other —
              // only animate the reveal for a plain (non-hazard) route,
              // where CSS setting stroke-dasharray itself is safe.
              dashArray: route.hazardsAvoided.length ? "8 6" : undefined,
              className: route.hazardsAvoided.length ? undefined : "orca-route-line",
            }}
          />
          {route.waypoints.map((point) => (
            <Marker
              key={point.sequence}
              position={[point.latitude, point.longitude]}
              icon={point.role === "bypass" ? geofenceIcon : point.role === "origin" || point.role === "destination" ? vesselIcon : waypointIcon}
            >
              <Popup>
                {mt(language, `role${point.role.charAt(0).toUpperCase()}${point.role.slice(1)}`)}
                {point.wave_height_m != null ? ` — ${mt(language, "routeWave", { wave: point.wave_height_m })}` : ""}
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
}
