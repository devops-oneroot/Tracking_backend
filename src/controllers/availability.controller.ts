import { Request, Response } from "express";
import AvailabilityResponse from "../models/AvailabilityResponse.model.js";

export const saveAvailabilityResponse = async (req: Request, res: Response) => {
  try {
    const { sessionId, available, lat, lng } = req.body;

    if (!sessionId || lat == null || lng == null || available == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const record = await AvailabilityResponse.create({
      sessionId,
      available,
      location: { lat, lng },
    });

    res.json({ success: true, data: record });
  } catch (err) {
    console.error("Availability Save Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
