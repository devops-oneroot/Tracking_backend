import { Request, Response } from "express";
import Farmer from "../models/Farmer.model.js";

/* ================= ONBOARD FARMER ================= */

export const createFarmer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      cropType,
      state,
      district,
      taluk,
      village,
      landSize,

      cropCost,
      inputSupplier,
      additionalInfo,
      paymentType,
      droneSprayingConsent,
      agronomistCareConsent,
      location,
      photo,
    } = req.body;

    if (!name || !phone || !cropType) {
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
      state,
      district,
      taluk,
      village,
      landSize,

      cropCost,
      inputSupplier,
      additionalInfo,
      paymentType,
      droneSprayingConsent,
      agronomistCareConsent,
      location,
      photo,
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
      state,
      district,
      taluk,
      village,

      paymentType,
      droneSprayingConsent,
      agronomistCareConsent,

      search,
    } = req.query;

    const query: any = {};

    /* ===== BASIC FILTERS ===== */
    if (cropType) query.cropType = cropType;
    if (state) query.state = state;
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (village) query.village = village;

    /* ===== NEW FILTERS ===== */
    if (paymentType) query.paymentType = paymentType;

    if (droneSprayingConsent !== undefined) {
      query.droneSprayingConsent = droneSprayingConsent === "true";
    }

    if (agronomistCareConsent !== undefined) {
      query.agronomistCareConsent = agronomistCareConsent === "true";
    }

    /* ===== SEARCH ===== */
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
    res.status(500).json({
      message: "Failed to fetch farmers",
      error,
    });
  }
};

/* ================= UPDATE FARMER ================= */
export const updateFarmer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      cropType,
      state,
      district,
      taluk,
      village,
      landSize,

      cropCost,
      inputSupplier,
      additionalInfo,
      paymentType,
      droneSprayingConsent,
      agronomistCareConsent,
      location,
      photo,
    } = req.body;

    const updatePayload: any = {};

    if (name !== undefined) updatePayload.name = name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (cropType !== undefined) updatePayload.cropType = cropType;

    if (state !== undefined) updatePayload.state = state;

    if (district !== undefined) updatePayload.district = district;
    if (taluk !== undefined) updatePayload.taluk = taluk;
    if (village !== undefined) updatePayload.village = village;

    if (landSize !== undefined) updatePayload.landSize = landSize;

    /* ===== NEW FIELDS ===== */
    if (cropCost !== undefined) updatePayload.cropCost = cropCost;
    if (inputSupplier !== undefined)
      updatePayload.inputSupplier = inputSupplier;

    if (additionalInfo !== undefined)
      updatePayload.additionalInfo = additionalInfo;

    if (paymentType !== undefined) updatePayload.paymentType = paymentType;

    if (droneSprayingConsent !== undefined)
      updatePayload.droneSprayingConsent = droneSprayingConsent;

    if (agronomistCareConsent !== undefined)
      updatePayload.agronomistCareConsent = agronomistCareConsent;

    if (location !== undefined) updatePayload.location = location;
    if (photo !== undefined) updatePayload.photo = photo;

    const farmer = await Farmer.findByIdAndUpdate(id, updatePayload, {
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
    res.status(500).json({
      message: "Failed to update farmer",
      error,
    });
  }
};
