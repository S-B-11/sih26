import mongoose from "mongoose";

/**
 * PfzZone Schema
 * Represents an INCOIS Potential Fishing Zone polygon with
 * oceanographic parameters derived from ISRO Oceansat-3 data.
 */
const pfzZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      enum: ["Arabian Sea", "Bay of Bengal", "Indian Ocean", "Lakshadweep Sea"],
      required: true
    },
    coastalState: {
      type: String,
      required: true
      // e.g. "Gujarat", "Kerala", "Tamil Nadu", "Andhra Pradesh"
    },
    sst: {
      type: String,  // e.g. "28.2 °C"
      required: true
    },
    chlorophyll: {
      type: String,  // e.g. "4.3 mg/m³"
      required: true
    },
    depth: String,   // e.g. "42m"
    species: String, // e.g. "Tuna, Mackerel, Sardine"
    confidence: String, // e.g. "94%"
    advisory: String,
    distanceFromShore: Number, // in Nautical Miles
    validFrom: { type: Date, default: Date.now },
    validUntil: Date,
    isActive: { type: Boolean, default: true },
    satellitePass: String, // e.g. "Oceansat-3 OCM-3 Sensor Pass #4120"
    geometry: {
      type: {
        type: String,
        enum: ["Polygon", "MultiPolygon"],
        required: true
      },
      coordinates: {
        type: [[[Number]]],
        required: true
      }
    }
  },
  { timestamps: true }
);

pfzZoneSchema.index({ isActive: 1, coastalState: 1 });
pfzZoneSchema.index({ geometry: "2dsphere" });

export default mongoose.model("PfzZone", pfzZoneSchema);
