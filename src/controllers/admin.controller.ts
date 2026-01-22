import TrackingSession from "../models/trackingSession.model.js";
import LocationPoint from "../models/locationPoint.model.js";

/* ===== DAY ROUTE ===== */
export const getUserDayTracking = async (req, res) => {
  const { userId, date } = req.query;

  const session = await TrackingSession.findOne({ userId, date });

  if (!session) return res.json({ session: null, points: [] });

  const points = await LocationPoint.find({
    sessionId: session._id,
  }).sort({ timestamp: 1 });

  res.json({ session, points });
};

/* ===== LIVE LOCATION ===== */
export const getLatestLocation = async (req, res) => {
  const { userId } = req.query;

  const lastSession = await TrackingSession.findOne({ userId }).sort({
    startTime: -1,
  });

  if (!lastSession) return res.json(null);

  const lastPoint = await LocationPoint.findOne({
    sessionId: lastSession._id,
  }).sort({ timestamp: -1 });

  res.json(lastPoint);
};
