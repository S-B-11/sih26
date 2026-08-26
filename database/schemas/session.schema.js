import mongoose from "mongoose";

/**
 * Session Schema
 * Persists a user's query and the corresponding ORCA AI response
 * for session history and analytics.
 */
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
      // Device fingerprint or future auth user ID
    },
    language: {
      type: String,
      enum: ["en", "hi", "ta", "te", "ml", "gu", "bn"],
      default: "en"
    },
    query: {
      text: { type: String, required: true },
      presetId: String,
      inputMethod: {
        type: String,
        enum: ["text", "voice", "preset"],
        default: "text"
      }
    },
    response: {
      answerText:   String,
      riskLevel:    String,
      hasMapLayers: Boolean,
      chartCount:   Number,
      evidenceCount: Number,
      agentStepsCompleted: Number
    },
    agentTrace: [
      {
        agentName: String,
        role: String,
        status: String,
        duration: Number,
        timestamp: String
      }
    ],
    // Performance metrics
    totalDurationMs: Number,
    isFlagged: { type: Boolean, default: false } // For manual review
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ "query.presetId": 1 });

export default mongoose.model("Session", sessionSchema);
