import PfzZone from "../../database/schemas/pfzZone.schema.js";
import Buoy from "../../database/schemas/buoy.schema.js";

/**
 * OceanDataService
 * Fetches ocean telemetry data from MongoDB.
 * Falls back to static mock data if DB is unavailable.
 */
export class OceanDataService {
  static async getAllPfzZones() {
    try {
      return await PfzZone.find({ isActive: true }).lean();
    } catch {
      return MOCK_PFZ_ZONES;
    }
  }

  static async getPfzById(id) {
    try {
      return await PfzZone.findById(id).lean();
    } catch {
      return MOCK_PFZ_ZONES.find((z) => z._id === id) || null;
    }
  }

  static async getAllBuoys() {
    try {
      return await Buoy.find({ status: "active" }).lean();
    } catch {
      return MOCK_BUOYS;
    }
  }

  static async getBuoyById(id) {
    try {
      return await Buoy.findById(id).lean();
    } catch {
      return MOCK_BUOYS.find((b) => b._id === id) || null;
    }
  }

  static async buildGeoJsonFeatureCollection() {
    const zones = await this.getAllPfzZones();
    const buoys = await this.getAllBuoys();

    const features = [
      ...zones.map((z) => ({
        type: "Feature",
        id: z._id,
        properties: { name: z.name, type: "pfz", sst: z.sst, chlorophyll: z.chlorophyll, species: z.species },
        geometry: z.geometry
      })),
      ...buoys.map((b) => ({
        type: "Feature",
        id: b._id,
        properties: { name: b.name, type: "buoy", sst: b.sst, waveHeight: b.waveHeight, windSpeed: b.windSpeed },
        geometry: { type: "Point", coordinates: [b.longitude, b.latitude] }
      }))
    ];

    return { type: "FeatureCollection", features };
  }
}

// ─── Fallback mock data (used when DB is not connected) ───────────────────────
const MOCK_PFZ_ZONES = [
  {
    _id: "pfz-zone-veraval",
    name: "INCOIS High Yield PFZ Zone Alpha (Veraval)",
    sst: "28.2 °C",
    chlorophyll: "4.3 mg/m³",
    species: "Pelagic (Tuna, Mackerel, Sardine)",
    isActive: true,
    geometry: {
      type: "Polygon",
      coordinates: [[[69.35, 20.65],[69.52, 20.72],[69.60, 20.58],[69.42, 20.50],[69.35, 20.65]]]
    }
  }
];

const MOCK_BUOYS = [
  {
    _id: "buoy-bd08",
    name: "INCOIS Ocean Buoy BD08",
    sst: "28.0 °C",
    waveHeight: "1.1 m",
    windSpeed: "12 kts",
    latitude: 20.62,
    longitude: 69.45,
    status: "active"
  }
];
