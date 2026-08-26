/**
 * ORCA Geofence Zones — SIH26176
 *
 * Simplified GeoJSON boundaries for:
 *   - India's Exclusive Economic Zone (EEZ, 200 NM)
 *   - Key Marine Protected Areas (MPAs)
 *   - Military Restricted Zones
 *
 * Production: replace with official MoES/MoD shapefiles.
 * Demo: these are deliberately simplified polygons adequate for point-in-zone tests.
 */

// ─── Zone definitions ─────────────────────────────────────────────────────────

export const GEOFENCE_ZONES = [
  // ── India EEZ outer boundary (simplified 8-point polygon) ─────────────────
  {
    id: "india-eez",
    type: "Feature",
    properties: {
      name: "India Exclusive Economic Zone (EEZ)",
      zoneType: "eez",
      severity: "advisory",
      message: "You are operating within India's EEZ (200 NM limit). Foreign vessel reporting obligations apply under UNCLOS Article 58.",
      authority: "Ministry of Earth Sciences / MoD",
      color: "#38bdf8",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [68.0, 8.0],
        [68.0, 24.0],
        [72.0, 26.5],
        [80.0, 22.0],
        [88.0, 22.0],
        [94.0, 18.0],
        [94.0, 8.0],
        [80.0, 4.5],
        [68.0, 8.0]
      ]]
    }
  },

  // ── Gulf of Mannar Marine National Park ───────────────────────────────────
  {
    id: "mpa-gulf-mannar",
    type: "Feature",
    properties: {
      name: "Gulf of Mannar Marine National Park",
      zoneType: "mpa",
      severity: "restricted",
      message: "⚠️ Entering Gulf of Mannar Marine National Park. Bottom trawling and coral extraction are prohibited under Wildlife Protection Act 1972.",
      authority: "Wildlife Crime Control Bureau / MoEFCC",
      color: "#4ade80",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [78.0, 8.5],
        [79.5, 8.5],
        [79.5, 9.8],
        [78.0, 9.8],
        [78.0, 8.5]
      ]]
    }
  },

  // ── Lakshadweep MPA ────────────────────────────────────────────────────────
  {
    id: "mpa-lakshadweep",
    type: "Feature",
    properties: {
      name: "Lakshadweep Marine Protected Area",
      zoneType: "mpa",
      severity: "restricted",
      message: "⚠️ Entering Lakshadweep MPA. Coral reef ecosystem — fishing activity requires permit from Lakshadweep Administration.",
      authority: "Lakshadweep Administration / MoEFCC",
      color: "#4ade80",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [71.5, 8.0],
        [74.5, 8.0],
        [74.5, 13.0],
        [71.5, 13.0],
        [71.5, 8.0]
      ]]
    }
  },

  // ── Sundarbans Ecologically Sensitive Zone ────────────────────────────────
  {
    id: "esz-sundarbans",
    type: "Feature",
    properties: {
      name: "Sundarbans Ecologically Sensitive Zone",
      zoneType: "esz",
      severity: "restricted",
      message: "⚠️ Entering Sundarbans ESZ. Speed limit 8 knots, no anchoring. UNESCO World Heritage Site — Tiger Reserve Core Zone ahead.",
      authority: "West Bengal Forest Dept / MoEFCC",
      color: "#a3e635",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [88.0, 21.0],
        [89.5, 21.0],
        [89.5, 22.5],
        [88.0, 22.5],
        [88.0, 21.0]
      ]]
    }
  },

  // ── Naval Restricted Zone — Karwar ────────────────────────────────────────
  {
    id: "restricted-karwar-naval",
    type: "Feature",
    properties: {
      name: "INS Kadamba Naval Base — Restricted Waters",
      zoneType: "restricted",
      severity: "restricted",
      message: "🚫 RESTRICTED ZONE: INS Kadamba (Project Seabird) Naval Base restricted waters. Unauthorised entry prohibited under Indian Navy Act.",
      authority: "Indian Navy / MoD",
      color: "#f87171",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [73.9, 14.5],
        [74.3, 14.5],
        [74.3, 14.9],
        [73.9, 14.9],
        [73.9, 14.5]
      ]]
    }
  },

  // ── Pakistan Maritime Boundary (IMBL) ─────────────────────────────────────
  {
    id: "imbl-pakistan",
    type: "Feature",
    properties: {
      name: "India–Pakistan International Maritime Boundary Line",
      zoneType: "imbl",
      severity: "critical",
      message: "🚨 CRITICAL: Approaching India–Pakistan International Maritime Boundary Line (IMBL). Risk of arrest/seizure by Pakistan Marine Security Agency. Return to Indian waters immediately.",
      authority: "Indian Coast Guard / Ministry of External Affairs",
      color: "#dc2626",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [66.5, 22.5],
        [68.0, 22.5],
        [68.0, 24.0],
        [66.5, 24.0],
        [66.5, 22.5]
      ]]
    }
  }
];

// ─── Point-in-polygon (Ray Casting Algorithm) ────────────────────────────────

/**
 * Test whether a point [lng, lat] is inside a GeoJSON Polygon ring.
 * Returns true if inside.
 */
function pointInRing(point, ring) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/**
 * Check if [lng, lat] is inside any geofence zone.
 * Returns an array of violated zone properties (empty = no violation).
 */
export function checkGeofence(lng, lat) {
  const point = [lng, lat];
  return GEOFENCE_ZONES.filter((zone) => {
    const coords = zone.geometry.coordinates;
    // For Polygon: coords[0] is the outer ring
    return pointInRing(point, coords[0]);
  }).map((zone) => ({
    id: zone.id,
    name: zone.properties.name,
    zoneType: zone.properties.zoneType,
    severity: zone.properties.severity,
    message: zone.properties.message,
    authority: zone.properties.authority,
  }));
}

// ─── Scenario location → coordinate map (for demo geofencing) ────────────────
export const SCENARIO_COORDS = {
  "pfz-today":           [69.47, 20.61],   // Veraval, Gujarat — inside EEZ
  "sea-safety":          [76.10, 9.95],    // Kochi offshore — inside EEZ
  "tide-weather":        [83.35, 17.68],   // Visakhapatnam — inside EEZ
  "cyclone-lightning":   [86.40, 19.00],   // Bay of Bengal — inside EEZ
  "safest-route":        [80.38, 13.15],   // Chennai offshore — inside EEZ
  "productivity-decline":[78.50, 9.20],    // Gulf of Mannar — triggers MPA alert!
  "default":             [72.82, 18.96],   // Mumbai Coast
};
