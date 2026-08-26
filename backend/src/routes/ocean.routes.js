import express from "express";
import {
  getAllPfzZones,
  getPfzById,
  getAllBuoys,
  getBuoyById,
  getGeoJsonLayers
} from "../controllers/ocean.controller.js";

const router = express.Router();

/**
 * GET /api/ocean/pfz          — All Potential Fishing Zones
 * GET /api/ocean/pfz/:id      — Single PFZ by ID
 * GET /api/ocean/buoys        — All ocean buoy telemetry
 * GET /api/ocean/buoys/:id    — Single buoy by ID
 * GET /api/ocean/geojson      — Full GeoJSON feature collection for the map
 */
router.get("/pfz",         getAllPfzZones);
router.get("/pfz/:id",     getPfzById);
router.get("/buoys",       getAllBuoys);
router.get("/buoys/:id",   getBuoyById);
router.get("/geojson",     getGeoJsonLayers);

export default router;
