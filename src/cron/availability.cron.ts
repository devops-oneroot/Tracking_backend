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

// export const startAvailabilityCron = () => {
//   cron.schedule("0 * * * *", async () => {
//     console.log("🔔 Availability reminder running (every 1 hour)...");

//     try {
//       const sessions = await TrackingSession.find({ isActive: true });

//       if (!sessions.length) {
//         console.log("ℹ️ No active tracking sessions");
//         return;
//       }

//       for (const s of sessions) {
//         const user = await User.findById(s.userId);
//         if (!user?.fcmToken) continue;

//         await sendPush(
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
export const startAvailabilityCron = () => {
  console.log("🚀 Availability reminder started");

  const THIRTY_MIN = 30 * 60 * 1000; // 30 minutes

  const runJob = async () => {
    console.log(
      "🔔 Availability reminder running (every 30 min from start)...",
    );

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
      console.error("❌ Availability Error:", err);
    }
  };

  // 🔥 run immediately
  runJob();

  // 🔁 then every 30 minutes from NOW
  setInterval(runJob, THIRTY_MIN);
};
