/**
 * ORCA Database Seed Script
 * Populates MongoDB with initial ocean buoy and PFZ zone data.
 * Run: node backend/src/utils/seed.js (or npm run seed from backend/)
 */

import "dotenv/config";
import mongoose from "mongoose";
import PfzZone from "../schemas/pfzZone.schema.js";
import Buoy from "../schemas/buoy.schema.js";
import Alert from "../schemas/alert.schema.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/orca_db";

const SEED_BUOYS = [
  {
    buoyId: "BD08", name: "INCOIS Ocean Buoy BD08 (Veraval)",
    latitude: 20.62, longitude: 69.45,
    sst: "28.0 °C", waveHeight: "1.1 m", windSpeed: "12 kts SW",
    pressure: "1011 hPa", status: "active"
  },
  {
    buoyId: "CB02", name: "INCOIS Ocean Buoy CB02 (Kochi)",
    latitude: 9.95, longitude: 76.10,
    sst: "29.1 °C", waveHeight: "3.9 m", windSpeed: "32 kts SW",
    pressure: "1004 hPa", status: "active"
  },
  {
    buoyId: "DS04", name: "INCOIS Vizag Met-Ocean Buoy DS04",
    latitude: 17.68, longitude: 83.35,
    sst: "28.6 °C", waveHeight: "1.2 m", windSpeed: "14 kts ENE",
    salinity: "34.2 PSU", status: "active"
  }
];

const SEED_PFZ_ZONES = [
  {
    name: "INCOIS High Yield PFZ Zone Alpha (Veraval, Gujarat)",
    region: "Arabian Sea", coastalState: "Gujarat",
    sst: "28.2 °C", chlorophyll: "4.3 mg/m³",
    species: "Pelagic (Tuna, Mackerel, Sardine)",
    depth: "42m", confidence: "94%",
    distanceFromShore: 18.5,
    advisory: "High productivity thermal front detected by Oceansat-3",
    isActive: true,
    geometry: {
      type: "Polygon",
      coordinates: [[[69.35,20.65],[69.52,20.72],[69.60,20.58],[69.42,20.50],[69.35,20.65]]]
    }
  },
  {
    name: "Vizag Slope PFZ Zone (Andhra Pradesh)",
    region: "Bay of Bengal", coastalState: "Andhra Pradesh",
    sst: "28.5 °C", chlorophyll: "3.8 mg/m³",
    species: "Ribbonfish, Anchovy, Sardine",
    isActive: true,
    geometry: {
      type: "Polygon",
      coordinates: [[[83.45,17.60],[83.60,17.72],[83.72,17.55],[83.52,17.48],[83.45,17.60]]]
    }
  }
];

const SEED_ALERTS = [
  {
    level: "low",
    type: "general",
    message: "Normal ocean conditions across most of Indian EEZ. Light winds and moderate swell.",
    source: "INCOIS OSF",
    affectedRegion: "India EEZ",
    coastalStates: ["Gujarat", "Maharashtra", "Goa", "Karnataka", "Kerala", "Tamil Nadu", "Andhra Pradesh", "Odisha", "West Bengal"]
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB:", MONGODB_URI.split("/").pop());

  // Clear existing
  await Promise.all([PfzZone.deleteMany({}), Buoy.deleteMany({}), Alert.deleteMany({})]);
  console.log("🗑  Cleared existing data");

  // Insert seed data
  await Buoy.insertMany(SEED_BUOYS);
  console.log(`✅ Inserted ${SEED_BUOYS.length} buoys`);

  await PfzZone.insertMany(SEED_PFZ_ZONES);
  console.log(`✅ Inserted ${SEED_PFZ_ZONES.length} PFZ zones`);

  await Alert.insertMany(SEED_ALERTS);
  console.log(`✅ Inserted ${SEED_ALERTS.length} alerts`);

  console.log("\n🎉 Database seeded successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
