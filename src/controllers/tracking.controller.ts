import LocationPoint from "../models/locationPoint.model.js";
import TrackingSession from "../models/trackingSession.model.js";
import { sendPush } from "../utils/expoPush.js";
import AvailabilityResponse from "../models/AvailabilityResponse.model.js";

/* ================= START TRACKING ================= */
export const startTracking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lat, lng, accuracy, startImage } = req.body;

    if (lat == null || lng == null || !startImage) {
      return res.status(400).json({ message: "Location and image required" });
    }

    // ✅ prevent multiple active sessions
    const existing = await TrackingSession.findOne({
      userId,
      endTime: { $exists: false },
    });

    if (existing) {
      return res.status(400).json({ message: "Tracking already running" });
    }

    const today = new Date().toISOString().split("T")[0];

    const session = await TrackingSession.create({
      userId,
      startTime: new Date(),
      date: today,
      startLocation: { lat, lng },
      startImage,
    });

    // save first route point
    await LocationPoint.create({
      userId,
      sessionId: session._id,
      lat,
      lng,
      accuracy,
      timestamp: new Date(),
    });

    res.json(session);
  } catch (err) {
    console.error("START TRACK ERROR:", err);
    res.status(500).json({ message: "Start tracking failed" });
  }
};

/* ================= AUTO SAVE POINT ================= */
export const autoSavePoint = async (req, res) => {
  try {
    const { sessionId, lat, lng, accuracy, timestamp, availability } = req.body;

    if (!sessionId || lat == null || lng == null) {
      return res.status(400).json({ message: "Invalid location data" });
    }

    const session = await TrackingSession.findById(sessionId);

    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Invalid session" });
    }

    if (session.endTime) {
      return res.status(400).json({ message: "Session already ended" });
    }

    await LocationPoint.create({
      userId: req.user.id,
      sessionId,
      lat,
      lng,
      accuracy,
      availability: availability ?? null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await TrackingSession.findByIdAndUpdate(sessionId, {
      $inc: { totalPoints: 1 },
    });

    res.json({ ok: true });
  } catch (err) {
    if (err?.code === 11000) return res.json({ ok: true });
    console.error("AUTO POINT ERROR:", err);
    res.status(500).json({ message: "Save point failed" });
  }
};

/* ================= OFFLINE SYNC ================= */
export const syncOfflinePoints = async (req, res) => {
  try {
    const { sessionId, points } = req.body;

    if (!sessionId || !Array.isArray(points)) {
      return res.status(400).json({ message: "Invalid sync payload" });
    }

    const session = await TrackingSession.findById(sessionId);

    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Invalid session" });
    }

    if (session.endTime) {
      return res.status(400).json({ message: "Session already ended" });
    }

    const docs = points.map((p) => ({
      userId: req.user.id,
      sessionId,
      lat: p.lat,
      lng: p.lng,
      accuracy: p.accuracy,
      availability: p.availability ?? null,
      timestamp: new Date(p.timestamp),
      fromOfflineSync: true,
    }));

    if (docs.length) {
      await LocationPoint.insertMany(docs, { ordered: false });

      await TrackingSession.findByIdAndUpdate(sessionId, {
        $inc: { totalPoints: docs.length },
      });
    }

    res.json({ synced: docs.length });
  } catch (err) {
    console.error("SYNC ERROR:", err);
    res.status(500).json({ message: "Sync failed" });
  }
};

export const stopTracking = async (req, res) => {
  try {
    const { sessionId, lat, lng, accuracy, endImage } = req.body;

    if (!sessionId || lat == null || lng == null || !endImage) {
      return res.status(400).json({ message: "Invalid stop data" });
    }

    const session = await TrackingSession.findById(sessionId);

    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Invalid session" });
    }

    if (session.endTime) {
      return res.status(400).json({ message: "Session already ended" });
    }

    await LocationPoint.create({
      userId: req.user.id,
      sessionId,
      lat,
      lng,
      accuracy,
      timestamp: new Date(),
    });

    await TrackingSession.findByIdAndUpdate(sessionId, {
      endTime: new Date(),
      endLocation: { lat, lng },
      endImage,
      isActive: false, // ✅ STOP CRON + STOP NOTIFICATIONS
    });

    // ✅ optional confirmation push
    if (req.user.expoPushToken) {
      await sendPush(
        req.user.expoPushToken,
        "Tracking Ended",
        "Your tracking session has been stopped",
        { type: "TRACKING_STOPPED", sessionId },
      );
    }

    console.log("🛑 Tracking stopped:", sessionId);

    res.json({ ok: true });
  } catch (err) {
    console.error("STOP TRACK ERROR:", err);
    res.status(500).json({ message: "Stop tracking failed" });
  }
};

/* ================= DASHBOARD / HISTORY ================= */

export const getTodayAllTracking = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const sessions = await TrackingSession.find({ date: today }).populate(
      "userId",
      "name phone",
    );

    const results = [];

    for (const s of sessions) {
      const points = await LocationPoint.find({ sessionId: s._id }).sort({
        timestamp: 1,
      });

      results.push({
        session: s,
        user: s.userId,
        points,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("TODAY TRACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserDayTracking = async (req, res) => {
  try {
    const { userId, date } = req.query;

    const session = await TrackingSession.findOne({ userId, date });

    if (!session) return res.json({ session: null, points: [] });

    const points = await LocationPoint.find({
      sessionId: session._id,
    }).sort({ timestamp: 1 });

    res.json({ session, points });
  } catch (err) {
    console.error("DAY TRACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserLatestTrackingById = async (req, res) => {
  try {
    const { userId } = req.params;

    const session = await TrackingSession.findOne({ userId })
      .sort({ startTime: -1 })
      .populate("userId", "name phone");

    if (!session) {
      return res.json({ user: null, session: null, points: [] });
    }

    const points = await LocationPoint.find({
      sessionId: session._id,
    }).sort({ timestamp: 1 });

    res.json({
      user: session.userId,
      session,
      points,
    });
  } catch (err) {
    console.error("USER LATEST TRACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTrackingBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await TrackingSession.findById(sessionId).populate(
      "userId",
      "name phone",
    );

    if (!session) {
      return res.json({
        user: null,
        session: null,
        points: [],
        latestAvailability: null,
        availabilityHistory: [],
      });
    }

    const points = await LocationPoint.find({
      sessionId: session._id,
    }).sort({ timestamp: 1 });

    // ✅ ALL availability responses for this session
    const availabilityHistory = await AvailabilityResponse.find({
      sessionId: session._id,
    }).sort({ createdAt: -1 });

    // ✅ latest response only
    const latestAvailability =
      availabilityHistory.length > 0 ? availabilityHistory[0] : null;

    res.json({
      user: session.userId,
      session,
      points,
      latestAvailability, // for status badge
      availabilityHistory, // for table / logs
    });
  } catch (err) {
    console.error("SESSION TRACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserTodayTrackingById = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const session = await TrackingSession.findOne({
      userId,
      date: today,
    }).populate("userId", "name phone");

    if (!session) {
      return res.json({ user: null, session: null, points: [] });
    }

    const points = await LocationPoint.find({
      sessionId: session._id,
    }).sort({ timestamp: 1 });

    res.json({
      user: session.userId,
      session,
      points,
    });
  } catch (err) {
    console.error("USER TRACK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsersTrackingHistory = async (req, res) => {
  try {
    const sessions = await TrackingSession.find({})
      .populate("userId", "name phone")
      .sort({ startTime: -1 }); // latest first

    const data = sessions.map((s) => ({
      sessionId: s._id,
      user: s.userId, // { name, phone }
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime || null,
    }));

    res.json({
      total: data.length,
      records: data,
    });
  } catch (err) {
    console.error("ALL HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
