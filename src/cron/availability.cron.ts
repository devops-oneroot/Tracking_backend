// import cron from "node-cron";
// import TrackingSession from "../models/trackingSession.model.js";
// import User from "../models/User.model.js";
// import { sendExpoPush } from "../utils/expoPush.js";

// export const startAvailabilityCron = () => {
//   cron.schedule("*/5 * * * *", async () => {
//     console.log("🔔 Availability reminder running...");

//     try {
//       const sessions = await TrackingSession.find({ isActive: true });

//       if (!sessions.length) {
//         console.log("ℹ️ No active tracking sessions");
//         return;
//       }

//       for (const s of sessions) {
//         const user = await User.findById(s.userId);
//         if (!user?.fcmToken) continue;

//         await sendExpoPush(
//           user.fcmToken,
//           "Call Availability",
//           "Are you available for call?",
//           {
//             sessionId: s._id.toString(),
//             type: "AVAILABILITY",
//           },
//         );

//         console.log("📤 Sent to", user._id.toString());
//       }
//     } catch (err) {
//       console.error("❌ Availability Cron Error:", err);
//     }
//   });
// };

import cron from "node-cron";
import TrackingSession from "../models/trackingSession.model.js";
import User from "../models/User.model.js";
import { sendPush } from "../utils/expoPush.js";

export const startAvailabilityCron = () => {
  // ⏰ Runs every 1 hours
  cron.schedule("0 * * * *", async () => {
    console.log("🔔 Availability reminder running (every 1 hour)...");

    // cron.schedule("*/5 * * * *", async () => {
    //   console.log("🔔 Availability reminder running...");

    try {
      const sessions = await TrackingSession.find({ isActive: true });

      if (!sessions.length) {
        console.log("ℹ️ No active tracking sessions");
        return;
      }

      for (const s of sessions) {
        const user = await User.findById(s.userId);
        if (!user?.fcmToken) continue;

        await sendPush(
          user.fcmToken,
          "Call Availability",
          "Are you available for call?",
          {
            sessionId: s._id.toString(),
            type: "AVAILABILITY",
          },
        );
        console.log("📤 Sent to", user._id.toString());
      }
    } catch (err) {
      console.error("❌ Availability Cron Error:", err);
    }
  });
};
