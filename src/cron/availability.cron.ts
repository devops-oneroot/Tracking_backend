import cron from "node-cron";
import TrackingSession from "../models/trackingSession.model.js";
import User from "../models/User.model.js";
import { sendAvailabilityNotification } from "../utils/notifications.js";

export const startAvailabilityCron = () => {
  // Runs every 20 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("🔔 Availability reminder running...");

    try {
      // ✅ Only active sessions (not ended)
      const sessions = await TrackingSession.find({
        endTime: { $exists: false },
      });

      if (!sessions.length) {
        console.log("ℹ️ No active tracking sessions");
        return;
      }

      for (const session of sessions) {
        const user = await User.findById(session.userId);

        if (!user?.fcmToken) {
          console.log("⚠️ No FCM token for user:", session.userId.toString());
          continue;
        }

        await sendAvailabilityNotification(
          user.fcmToken,
          session._id.toString(),
        );

        console.log("📤 Notification sent to user:", user._id.toString());
      }
    } catch (err) {
      console.error("❌ Availability Cron Error:", err);
    }
  });
};
