import { Request, Response } from "express";
import Visit from "../models/Visit.model.js";

export const createVisit = async (req: Request, res: Response) => {
  const visit = await Visit.create({
    user: req.body.userId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    hasLoad: req.body.hasLoad,
    remark: req.body.remark,
    image: req.body.image, // ✅ JSON string
  });

  res.status(201).json(visit);
};

// export const getAllVisits = async (req: Request, res: Response) => {
//   try {
//     const visits = await Visit.find()
//       .populate("user", "name phone role")
//       .sort({ createdAt: -1 });

//     res.json(visits);
//   } catch (error: any) {
//     res.status(500).json({
//       message: "Failed to fetch visits",
//       error: error.message,
//     });
//   }
// };
export const getAllVisits = async (req: Request, res: Response) => {
  try {
    const { hasLoad } = req.query;

    const query: any = {};

    if (hasLoad !== undefined) {
      query.hasLoad = hasLoad === "true"; // string → boolean
    }

    const visits = await Visit.find(query)
      .populate("user", "name phone role")
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch visits",
      error: error.message,
    });
  }
};

export const getVisitsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const visits = await Visit.find({ user: userId }).sort({ createdAt: -1 });

    res.json(visits);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch user visits" });
  }
};

export const getVisitsByLoadStatus = async (req: Request, res: Response) => {
  try {
    const { hasLoad } = req.query;

    const query: any = {};
    if (hasLoad !== undefined) {
      query.hasLoad = hasLoad === "true";
    }

    const visits = await Visit.find(query)
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (e) {
    res.status(500).json({ message: "Failed to filter visits" });
  }
};

export const getTodayVisits = async (req: Request, res: Response) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const visits = await Visit.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch today visits" });
  }
};
