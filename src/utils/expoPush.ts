import fetch from "node-fetch";

type ExpoPushResponse = {
  data?: {
    status?: string;
    id?: string;
    message?: string;
    details?: any;
  };
  errors?: any[];
};

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

  const json = (await res.json()) as ExpoPushResponse;

  if (json.data?.status !== "ok") {
    console.error("❌ Expo Push Failed:", json);
  } else {
    console.log("✅ Expo Push Sent:", json.data?.id);
  }
}
