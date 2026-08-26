/**
 * ORCA Database Configuration
 * Central config for MongoDB connection options.
 */
export const dbConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/orca_db",

  options: {
    // Connection pool
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  },

  // Collections
  collections: {
    pfzZones:  "pfzzones",
    buoys:     "buoys",
    alerts:    "alerts",
    sessions:  "sessions"
  }
};
