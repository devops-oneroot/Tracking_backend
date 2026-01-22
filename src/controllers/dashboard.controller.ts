import { Request, Response } from "express";
import Visit from "../models/Visit.model.js";
import Load from "../models/Load.model.js";

export const getDashboardLoads = async (req: Request, res: Response) => {
  try {
    // 🔹 latest visits (you can also filter today if needed)
    const visits = await Visit.find()
      .populate("user", "name phone role")
      .sort({ createdAt: -1 });

    const result: any[] = [];

    for (const visit of visits) {
      let load = null;

      if (visit.hasLoad) {
        // since Visit has load field
        if (visit.load) {
          load = await Load.findById(visit.load)
            .populate("aggregator", "name phone")
            .populate("user", "name phone");
        } else {
          // fallback if load field missing
          load = await Load.findOne({ visit: visit._id })
            .populate("aggregator", "name phone")
            .populate("user", "name phone");
        }
      }

      result.push({
        user: visit.user,
        hasLoad: visit.hasLoad,

        visit: {
          _id: visit._id,
          latitude: visit.latitude,
          longitude: visit.longitude,
          image: visit.image,
          remark: visit.remark,
          createdAt: visit.createdAt,
        },

        load: load
          ? {
              _id: load._id,
              productName: load.productName,
              numberOfVehicles: load.numberOfVehicles,
              from: load.from,
              to: load.to,
              pricePaying: load.pricePaying,
              status: load.status,
              completionImage: load.completionImage,
              loadStartedAt: load.loadStartedAt,
              loadEndedAt: load.loadEndedAt,
              aggregator: load.aggregator,
            }
          : null,
      });
    }

    res.json(result);
  } catch (e) {
    console.error("DASHBOARD LOAD ERROR:", e);
    res.status(500).json({ message: "Failed to fetch dashboard loads" });
  }
};

export const getVisitDashboard = async (req, res) => {
  try {
    const { visitId } = req.params;

    const visit = await Visit.findById(visitId).populate(
      "user",
      "name phone role",
    );

    if (!visit) return res.status(404).json({ message: "Visit not found" });

    let load = null;

    if (visit.hasLoad) {
      load = await Load.findOne({ visit: visit._id }).populate(
        "aggregator",
        "name",
      );
    }

    res.json({
      user: visit.user,
      hasLoad: visit.hasLoad,
      visit: {
        _id: visit._id,
        latitude: visit.latitude,
        longitude: visit.longitude,
        image: visit.image,
        remark: visit.remark,
        createdAt: visit.createdAt,
      },
      load,
    });
  } catch (e) {
    console.error("Visit dashboard error:", e);
    res.status(500).json({ message: "Failed to load visit dashboard" });
  }
};
