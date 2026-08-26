import { AlertService } from "../services/alert.service.js";

export async function getActiveAlerts(_req, res, next) {
  try {
    const alerts = await AlertService.getActive();
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (err) { next(err); }
}

export async function createAlert(req, res, next) {
  try {
    const alert = await AlertService.create(req.body);
    res.status(201).json({ success: true, data: alert });
  } catch (err) { next(err); }
}

export async function dismissAlert(req, res, next) {
  try {
    await AlertService.dismiss(req.params.id);
    res.status(200).json({ success: true, message: "Alert dismissed" });
  } catch (err) { next(err); }
}
