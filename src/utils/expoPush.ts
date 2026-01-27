import fetch from "node-fetch";

export async function sendExpoPush(
  token: string,
  title: string,
  body: string,
  data: any = {},
) {
  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      sound: "default",
      priority: "high",
      title,
      body,
      data,
    }),
  });

  const json = await res.json();

  if (json.data?.status !== "ok") {
    console.error("❌ Expo Push Failed:", JSON.stringify(json));
  } else {
    console.log("✅ Expo Push Sent:", json.data.id);
  }
}
