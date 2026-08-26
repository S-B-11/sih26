import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║        ORCA Backend API Server — ISRO/INCOIS         ║
  ║  Marine EcoSystem Reasoning with Collaborative Agents║
  ╠══════════════════════════════════════════════════════╣
  ║  Status  : 🟢 Running                               ║
  ║  Port    : ${PORT}                                       ║
  ║  Env     : ${process.env.NODE_ENV || "development"}                        ║
  ║  DB      : ${process.env.MONGODB_URI?.split("/").pop() || "orca_db"}                            ║
  ╚══════════════════════════════════════════════════════╝
  `);
});
