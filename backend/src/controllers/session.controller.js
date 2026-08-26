import { SessionService } from "../services/session.service.js";

export async function getSessionHistory(req, res, next) {
  try {
    const sessions = await SessionService.getByUser(req.params.userId);
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (err) { next(err); }
}

export async function saveSession(req, res, next) {
  try {
    const session = await SessionService.save(req.body);
    res.status(201).json({ success: true, data: session });
  } catch (err) { next(err); }
}

export async function deleteSession(req, res, next) {
  try {
    await SessionService.delete(req.params.id);
    res.status(200).json({ success: true, message: "Session deleted" });
  } catch (err) { next(err); }
}
