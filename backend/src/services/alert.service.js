import Alert from "../../database/schemas/alert.schema.js";

export class AlertService {
  static async getActive() {
    try {
      return await Alert.find({ isDismissed: false }).sort({ createdAt: -1 }).lean();
    } catch {
      return [];
    }
  }

  static async create(data) {
    try {
      const alert = new Alert(data);
      return await alert.save();
    } catch {
      return { ...data, _id: `mock-${Date.now()}`, createdAt: new Date() };
    }
  }

  static async dismiss(id) {
    try {
      await Alert.findByIdAndUpdate(id, { isDismissed: true });
    } catch {
      // Silently handle mock mode
    }
  }
}
