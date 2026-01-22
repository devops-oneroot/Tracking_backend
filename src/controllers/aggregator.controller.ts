import { Request, Response } from "express";
import Aggregator from "../models/Aggregator.model.js";

export const onboardAggregator = async (req: Request, res: Response) => {
  try {
    console.log("📝 Onboard payload:", req.body);

    const {
      mobileNumber,
      name,
      state,
      district,
      taluk,
      village,

      productDealing,
      selfieImage,
      storeImage,
    } = req.body;

    // ✅ REQUIRED FIELD CHECK
    if (
      !mobileNumber ||
      !name ||
      !state ||
      !village ||
      !taluk ||
      !district ||
      !productDealing ||
      !selfieImage ||
      !storeImage
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ CHECK DUPLICATE BY MOBILE NUMBER
    const exists = await Aggregator.findOne({ mobileNumber });

    if (exists) {
      return res.status(409).json({
        message: "Aggregator already present with this number",
      });
    }

    // ✅ CREATE NEW AGGREGATOR
    const agg = await Aggregator.create(req.body);

    console.log("✅ Aggregator onboarded:", agg._id);

    res.status(201).json({
      message: "Aggregator onboarded successfully",
      aggregator: agg,
    });
  } catch (e: any) {
    console.error("❌ Onboard error:", e);

    // Mongo duplicate safety
    if (e.code === 11000) {
      return res.status(409).json({
        message: "Aggregator already present",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};

export const findAggregatorByMobile = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.params;

    const agg = await Aggregator.findOne({ mobileNumber: mobile });

    if (!agg) {
      return res.status(404).json({ message: "Aggregator not found" });
    }

    res.json(agg);
  } catch (e) {
    res.status(500).json({ message: "Failed to find aggregator" });
  }
};

// aggregator.controller.ts
export const searchAggregators = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.query;

    if (!mobile || String(mobile).length < 6) {
      return res.json([]);
    }

    const list = await Aggregator.find({
      mobileNumber: { $regex: `^${mobile}` }, // starts with
    })
      .limit(5)
      .select("name mobileNumber village taluk productDealing");

    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Search failed" });
  }
};

// GET /api/aggregators
export const getAllAggregators = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { mobileNumber: { $regex: search } },
            { village: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Aggregator.countDocuments(filter);

    const aggregators = await Aggregator.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: aggregators,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error("❌ getAllAggregators:", e);
    res.status(500).json({ message: "Failed to fetch aggregators" });
  }
};

// GET /api/aggregators/:id
export const getAggregatorById = async (req, res) => {
  try {
    const { id } = req.params;

    const agg = await Aggregator.findById(id);

    if (!agg) {
      return res.status(404).json({ message: "Aggregator not found" });
    }

    res.json(agg);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch aggregator" });
  }
};

// PUT /api/aggregators/:id
export const updateAggregator = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "mobileNumber",
      "state",
      "district",
      "taluk",
      "village",
      "productDealing",
      "selfieImage",
      "storeImage",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const agg = await Aggregator.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!agg) {
      return res.status(404).json({ message: "Aggregator not found" });
    }

    res.json({
      message: "Aggregator updated successfully",
      aggregator: agg,
    });
  } catch (e) {
    console.error("❌ updateAggregator:", e);
    res.status(500).json({ message: "Failed to update aggregator" });
  }
};
