import Session from "../../database/schemas/session.schema.js";

export class SessionService {
  static async getByUser(userId) {
    try {
      return await Session.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
    } catch {
      return [];
    }
  }

  static async save(data) {
    try {
      const session = new Session(data);
      return await session.save();
    } catch {
      return { ...data, _id: `mock-${Date.now()}`, createdAt: new Date() };
    }
  }

  static async delete(id) {
    try {
      await Session.findByIdAndDelete(id);
    } catch {
      // Silently handle mock mode
    }
  }
}
