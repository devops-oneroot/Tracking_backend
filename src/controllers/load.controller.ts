// import Load from "../models/Load.model.js";

import Load from "../models/Load.model.js";
import Visit from "../models/Visit.model.js";
import { Request, Response } from "express";

export const createLoad = async (req: Request, res: Response) => {
  try {
    const { visitId, aggregatorId } = req.body;

    const visit = await Visit.findById(visitId);
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    if (!aggregatorId) {
      return res.status(400).json({ message: "Aggregator required" });
    }

    const load = await Load.create({
      visit: visit._id,
      user: visit.user,
      aggregator: aggregatorId, // ✅ LINK AGGREGATOR

      productName: req.body.productName,
      numberOfVehicles: req.body.numberOfVehicles,
      from: req.body.from,
      to: req.body.to,
      pricePaying: req.body.pricePaying,
      loadStartedAt: req.body.loadStartedAt,
      status: "pending",
    });

    await Visit.findByIdAndUpdate(visit._id, { load: load._id });

    res.status(201).json(load);
  } catch (e) {
    console.error("Create load error:", e);
    res.status(500).json({ message: "Failed to create load" });
  }
};

export const getPendingLoadsByUser = async (req: Request, res: Response) => {
  try {
    const loads = await Load.find({
      user: req.params.userId,
      status: "pending",
    })
      .populate("visit")
      .populate("aggregator")
      .sort({ createdAt: -1 });

    res.json(loads);
  } catch (e: any) {
    res.status(500).json({ message: "Failed to fetch loads" });
  }
};

export const completeLoad = async (req: Request, res: Response) => {
  try {
    const load = await Load.findByIdAndUpdate(
      req.params.id,
      {
        loadEndedAt: req.body.loadEndedAt,
        completionImage: req.body.completionImage,
        status: "completed", // ✅ IMPORTANT
      },
      { new: true },
    );

    if (!load) return res.status(404).json({ message: "Load not found" });

    res.json(load);
  } catch (e: any) {
    res.status(500).json({ message: "Failed to complete load" });
  }
};

export const getLoadStats = async (req: Request, res: Response) => {
  try {
    const total = await Load.countDocuments();
    const pending = await Load.countDocuments({ status: "pending" });
    const completed = await Load.countDocuments({ status: "completed" });

    res.json({ total, pending, completed });
  } catch (e) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

export const getAllLoads = async (req: Request, res: Response) => {
  try {
    const loads = await Load.find()
      .populate("user", "name phone")
      .populate("aggregator", "name phone")
      .populate("visit")
      .sort({ createdAt: -1 });

    res.json(loads);
  } catch (e: any) {
    res.status(500).json({ message: "Failed to fetch loads" });
  }
};

export const getCompletedLoads = async (req: Request, res: Response) => {
  try {
    const loads = await Load.find({ status: "completed" })
      .populate("user", "name phone")
      .populate("aggregator", "name phone")
      .sort({ updatedAt: -1 });

    res.json(loads);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch completed loads" });
  }
};

export const filterLoads = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;

    const query: any = {};

    if (status) query.status = status; // pending / completed

    if (date) {
      const start = new Date(date as string);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date as string);
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    }

    const loads = await Load.find(query)
      .populate("user", "name phone")
      .populate("aggregator", "name phone")
      .sort({ createdAt: -1 });

    res.json(loads);
  } catch (e) {
    res.status(500).json({ message: "Failed to filter loads" });
  }
};
