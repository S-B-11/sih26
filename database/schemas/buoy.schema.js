import mongoose from "mongoose";

/**
 * Buoy Schema
 * Represents an INCOIS/NIOT ocean buoy with real-time
 * telemetry: SST, wave height, wind speed, pressure, salinity.
 */
const buoySchema = new mongoose.Schema(
  {
    buoyId: {
      type: String,
      required: true,
      unique: true
      // e.g. "BD08", "CB02", "DS04"
    },
    name: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    // Latest telemetry readings
    sst: String,         // Sea Surface Temperature e.g. "28.0 °C"
    waveHeight: String,  // Significant Wave Height e.g. "1.1 m"
    windSpeed: String,   // Wind speed & direction e.g. "12 kts SW"
    pressure: String,    // Atmospheric pressure e.g. "1011 hPa"
    salinity: String,    // Salinity e.g. "34.2 PSU"
    visibility: String,  // e.g. "8.5 NM"
    // Meta
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    },
    lastSyncAt: { type: Date, default: Date.now },
    operator: {
      type: String,
      default: "INCOIS / NIOT"
    }
  },
  { timestamps: true }
);

buoySchema.index({ latitude: 1, longitude: 1 });
buoySchema.index({ buoyId: 1 }, { unique: true });
buoySchema.index({ status: 1 });

export default mongoose.model("Buoy", buoySchema);
