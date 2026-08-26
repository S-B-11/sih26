import mongoose from "mongoose";

/**
 * Alert Schema
 * Represents a maritime risk alert or weather advisory
 * broadcast via INCOIS OSF (Ocean State Forecast).
 */
const alertSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true
    },
    type: {
      type: String,
      enum: [
        "high_wave",
        "cyclone",
        "lightning",
        "rip_current",
        "restricted_zone",
        "fog",
        "general"
      ],
      default: "general"
    },
    message: {
      type: String,
      required: true
    },
    // Multilingual messages (optional)
    messageTranslations: {
      hi: String,
      ta: String,
      te: String,
      ml: String,
      gu: String,
      bn: String
    },
    affectedRegion: String,  // e.g. "Offshore Kochi, Kerala"
    coastalStates: [String], // e.g. ["Kerala", "Tamil Nadu"]
    source: {
      type: String,
      default: "INCOIS OSF"
    },
    validFrom: { type: Date, default: Date.now },
    validUntil: Date,
    isDismissed: { type: Boolean, default: false },
    dismissedAt: Date,
    broadcastId: String // INCOIS broadcast reference ID
  },
  { timestamps: true }
);

alertSchema.index({ level: 1, isDismissed: 1 });
alertSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 }); // Auto-expire alerts

export default mongoose.model("Alert", alertSchema);
