// import { Request, Response } from "express";
// import { LocationPoint } from "../models/LocationPoint.model";
// import { TrackingSession } from "../models/TrackingSession.model";

// interface LocationDTO {
//   latitude: number;
//   longitude: number;
//   accuracy?: number;
//   capturedAt: string;
// }

// export const saveLocations = async (req: Request, res: Response) => {
//   try {
//     const { sessionId, locations } = req.body as {
//       sessionId: string;
//       locations: LocationDTO[];
//     };

//     const session = await TrackingSession.findById(sessionId);
//     if (!session || !session.isActive) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or inactive session",
//       });
//     }

//     const docs = locations.map((loc) => ({
//       session: session._id,
//       latitude: loc.latitude,
//       longitude: loc.longitude,
//       accuracy: loc.accuracy,
//       capturedAt: new Date(loc.capturedAt),
//     }));

//     await LocationPoint.insertMany(docs, { ordered: false });

//     res.json({ success: true, message: "Locations saved" });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const uploadTrackingImage = async (req: Request, res: Response) => {
//   try {
//     const { sessionId, imageUrl, type } = req.body;

//     const session = await TrackingSession.findById(sessionId);
//     if (!session) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Session not found" });
//     }

//     if (type === "start") session.startImage = imageUrl;
//     if (type === "stop") session.stopImage = imageUrl;

//     await session.save();

//     res.json({ success: true, message: "Image uploaded" });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const stopTracking = async (req: Request, res: Response) => {
//   try {
//     const { sessionId, stopImage } = req.body;

//     const session = await TrackingSession.findById(sessionId);
//     if (!session || !session.isActive) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid session" });
//     }

//     session.isActive = false;
//     session.stoppedAt = new Date();
//     if (stopImage) session.stopImage = stopImage;

//     await session.save();

//     res.json({ success: true, message: "Tracking stopped" });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
