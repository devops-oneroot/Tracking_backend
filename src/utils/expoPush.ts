// import fetch from "node-fetch";

// export async function sendExpoPush(
//   token: string,
//   title: string,
//   body: string,
//   data: any = {},
// ) {
//   const res = await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       to: token,
//       sound: "default",
//       priority: "high",
//       title,
//       body,
//       data,
//     }),
//   });

//   const json: any = await res.json();

//   if (json?.data?.status !== "ok") {
//     console.error("❌ Expo Push Failed:", json);
//   } else {
//     console.log("✅ Expo Push Sent:", json.data.id);
//   }
// }

import fetch from "node-fetch";

export async function sendExpoAvailabilityPush(
  token: string,
  sessionId: string,
) {
  const payload = {
    to: token,
    title: "Call Availability",
    body: "Are you available for call?",
    categoryId: "AVAILABILITY_ACTION",
    data: {
      type: "AVAILABILITY",
      sessionId,
    },
  };

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json: any = await res.json();

  if (json?.data?.status !== "ok") {
    console.error("❌ Expo Push Failed:", json);
  } else {
    console.log("✅ Expo Push Sent:", json.data.id);
  }

  return json;
}
