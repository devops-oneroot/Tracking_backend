import Task from "../models/Task.model.js";
import User from "../models/User.model.js";
import { sendPush } from "../utils/expoPush.js";

/* ================= ASSIGN TASK (DASHBOARD) ================= */

/* ================= ASSIGN TASK ================= */
// export const assignTask = async (req, res) => {
//   try {
//     const { userId, title, description } = req.body;

//     if (!userId || !title) {
//       return res.status(400).json({ message: "userId and title required" });
//     }

//     const task = await Task.create({
//       title,
//       description,
//       assignedTo: userId,
//       assignedBy: "ADMIN",
//     });

//     res.json(task);
//   } catch (err) {
//     console.error("ASSIGN TASK ERROR:", err);
//     res.status(500).json({ message: "Assign task failed" });
//   }
// };

export const assignTask = async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    console.log("🟡 ASSIGN TASK API HIT");
    console.log("➡️ Payload:", { userId, title, description });

    if (!userId || !title) {
      console.log("❌ Missing userId or title");
      return res.status(400).json({ message: "userId and title required" });
    }

    // 1️⃣ Create task
    const task = await Task.create({
      title,
      description,
      assignedTo: userId,
      assignedBy: "ADMIN",
    });

    console.log("✅ Task created:", task._id.toString());

    // 2️⃣ Fetch user's push token
    const user = await User.findById(userId).select("fcmToken name");

    if (!user) {
      console.log("❌ User not found:", userId);
    } else {
      console.log("👤 User found:", user.name);
      console.log("📱 User fcmToken:", user.fcmToken);
    }

    // 3️⃣ Send push notification (ONCE)
    if (user?.fcmToken) {
      console.log("🚀 Sending TASK_ASSIGNED push...");

      const expoRes = await sendPush(
        user.fcmToken,
        title, // 🔥 task title as notification title
        "You have a new task assigned",
        {
          type: "TASK_ASSIGNED",
          taskId: task._id.toString(),
        },
      );

      console.log("📦 EXPO RESPONSE:", expoRes);
      console.log("📤 Task push sent to user:", userId);
    } else {
      console.log("⚠️ No fcmToken for user:", userId);
    }

    res.json(task);
  } catch (err) {
    console.error("❌ ASSIGN TASK ERROR:", err);
    res.status(500).json({ message: "Assign task failed" });
  }
};

/* ================= USER: GET MY TASKS ================= */
export const getMyTasks = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ FROM URL PARAM

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const tasks = await Task.find({
      assignedTo: userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("GET MY TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= USER: COMPLETE TASK ================= */
export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await Task.findByIdAndUpdate(taskId, {
      status: "completed",
      completedAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("COMPLETE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DASHBOARD: USER TASK HISTORY ================= */
export const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ assignedTo: userId }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { userId, status } = req.query;

    const filter: any = {};

    if (userId) filter.assignedTo = userId;
    if (status) filter.status = status; // pending | completed

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name phone") // if you have User model
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("GET ALL TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserPendingTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const tasks = await Task.find({
      assignedTo: userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("GET USER TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
