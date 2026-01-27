import { fcm } from "../config/firebase.js";

export const testPush = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "FCM token required" });
    }

    await fcm.send({
      token,
      notification: {
        title: "Test Push",
        body: "Firebase notification working 🎉",
      },
      android: {
        priority: "high",
      },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("PUSH ERROR:", err);
    res.status(500).json({ message: "Push failed", err });
  }
};
