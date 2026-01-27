import { fcm } from "../config/firebase.js";

export const sendAvailabilityNotification = async (
  token: string,
  sessionId: string,
) => {
  const message = {
    token,
    notification: {
      title: "Call Availability",
      body: "Are you available for call?",
    },
    data: {
      type: "AVAILABILITY",
      sessionId,
    },
    android: {
      priority: "high" as const,
    },
  };

  await fcm.send(message);
};
