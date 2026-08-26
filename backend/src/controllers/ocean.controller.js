import { OceanDataService } from "../services/ocean.service.js";

export async function getAllPfzZones(req, res, next) {
  try {
    const zones = await OceanDataService.getAllPfzZones();
    res.status(200).json({ success: true, count: zones.length, data: zones });
  } catch (err) { next(err); }
}

export async function getPfzById(req, res, next) {
  try {
    const zone = await OceanDataService.getPfzById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, error: "PFZ zone not found" });
    res.status(200).json({ success: true, data: zone });
  } catch (err) { next(err); }
}

export async function getAllBuoys(req, res, next) {
  try {
    const buoys = await OceanDataService.getAllBuoys();
    res.status(200).json({ success: true, count: buoys.length, data: buoys });
  } catch (err) { next(err); }
}

export async function getBuoyById(req, res, next) {
  try {
    const buoy = await OceanDataService.getBuoyById(req.params.id);
    if (!buoy) return res.status(404).json({ success: false, error: "Buoy not found" });
    res.status(200).json({ success: true, data: buoy });
  } catch (err) { next(err); }
}

export async function getGeoJsonLayers(req, res, next) {
  try {
    const geojson = await OceanDataService.buildGeoJsonFeatureCollection();
    res.status(200).json({ success: true, data: geojson });
  } catch (err) { next(err); }
}
