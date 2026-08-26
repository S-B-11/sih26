import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/orca_db";

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected → ${uri.split("/").pop()}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.warn("⚠️  Running without database — mock data mode active.");
    // In dev mode, allow server to run without DB (uses mock data)
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected.");
  });
}
