import { Request, Response } from "express";
import Farmer from "../models/Farmer.model.js";

/* ================= ONBOARD FARMER ================= */
export const createFarmer = async (req: Request, res: Response) => {
  try {
    const { name, phone, cropType, district, taluk, village, landSize } =
      req.body;

    if (!name || !phone || !cropType || !district || !taluk || !village) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Farmer.findOne({ phone });
    if (exists) {
      return res.status(409).json({ message: "Farmer already exists" });
    }

    const farmer = await Farmer.create({
      name,
      phone,
      cropType,
      district,
      taluk,
      village,
      landSize,
    });

    res.status(201).json({
      message: "Farmer onboarded successfully",
      farmer,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to onboard farmer", error });
  }
};

/* ================= FETCH FARMERS (DASHBOARD) ================= */
export const getFarmers = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      cropType,
      district,
      taluk,
      village,
      search,
    } = req.query;

    const query: any = {};

    if (cropType) query.cropType = cropType;
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (village) query.village = village;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const [farmers, total] = await Promise.all([
      Farmer.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Farmer.countDocuments(query),
    ]);

    res.json({
      data: farmers,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch farmers", error });
  }
};

/* ================= UPDATE FARMER ================= */
export const updateFarmer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const farmer = await Farmer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res.json({
      message: "Farmer updated successfully",
      farmer,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update farmer", error });
  }
};
