// controllers/farmer.controller.ts

import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Farmer, { IFarmer } from "../models/Farmer.model.js";

interface CreateFarmerBody {
  name: string;
  phone: string;
  onboardedBy?: string;
  crops: Array<{
    name: string;
    price?: string;
    additionalInfo?: string;
  }>;
  additionalCrops?: string;
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  landSize?: number | string;
  inputSupplier?: string;
  additionalInfo?: string;
  payment?: {
    type?: "cash" | "credit";
    additionalInfo?: string;
  };
  droneSprayingConsent?: boolean | { value: boolean; additionalInfo?: string };
  agronomistCareConsent?: boolean | { value: boolean; additionalInfo?: string };
  location?: {
    latitude: number;
    longitude: number;
  };
  photo?: string;
}

interface UpdateFarmerBody extends Partial<CreateFarmerBody> {}

interface PaginationQuery {
  page?: string;
  limit?: string;
  cropName?: string;
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  paymentType?: "cash" | "credit";
  droneSprayingConsent?: string | boolean;
  agronomistCareConsent?: string | boolean;
  search?: string;
}

export const createFarmer = async (
  req: Request<{}, {}, CreateFarmerBody>,
  res: Response,
) => {
  try {
    const {
      name,
      phone,
      crops = [],
      onboardedBy,
      additionalCrops,
      state,
      district,
      taluk,
      village,
      landSize,
      inputSupplier,
      additionalInfo,
      payment,
      droneSprayingConsent,
      agronomistCareConsent,
      location,
      photo,
    } = req.body;

    // Required fields
    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Farmer name is required" });
    }

    if (!phone?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    // Normalize phone (remove all non-digits)
    const normalizedPhone = phone.trim().replace(/\D/g, "");

    if (normalizedPhone.length < 10 || normalizedPhone.length > 13) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number format" });
    }

    // Check duplicate
    const existing = await Farmer.findOne({ phone: normalizedPhone });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Farmer with this phone number already exists",
      });
    }

    // Validate crops

    // Normalize consents (support both boolean and object from frontend)
    let finalDroneConsent = droneSprayingConsent;
    if (typeof droneSprayingConsent === "boolean") {
      finalDroneConsent = { value: droneSprayingConsent, additionalInfo: "" };
    }

    let finalAgronomistConsent = agronomistCareConsent;
    if (typeof agronomistCareConsent === "boolean") {
      finalAgronomistConsent = {
        value: agronomistCareConsent,
        additionalInfo: "",
      };
    }

    // Prepare clean document
    const farmerData: Partial<IFarmer> = {
      name: name.trim(),
      phone: normalizedPhone,
      onboardedBy: onboardedBy
        ? new mongoose.Types.ObjectId(onboardedBy)
        : undefined,
      crops: crops.map((c) => ({
        name: c.name.trim(),
        price: c.price?.trim(),
        additionalInfo: c.additionalInfo?.trim(),
      })),

      additionalCrops: additionalCrops?.trim(),
      state: state?.trim(),
      district: district?.trim(),
      taluk: taluk?.trim(),
      village: village?.trim(),
      landSize: landSize ? Number(landSize) : undefined,
      inputSupplier: inputSupplier?.trim(),
      additionalInfo: additionalInfo?.trim(),
      payment: payment
        ? {
            type:
              payment.type === "cash" || payment.type === "credit"
                ? payment.type
                : undefined,
            additionalInfo: payment.additionalInfo?.trim(),
          }
        : undefined,
      droneSprayingConsent:
        finalDroneConsent as IFarmer["droneSprayingConsent"],
      agronomistCareConsent:
        finalAgronomistConsent as IFarmer["agronomistCareConsent"],
      location:
        location?.latitude && location?.longitude
          ? {
              latitude: Number(location.latitude),
              longitude: Number(location.longitude),
            }
          : undefined,
      photo: photo?.trim(),
    };

    const newFarmer = await Farmer.create(farmerData);

    return res.status(201).json({
      success: true,
      message: "Farmer onboarded successfully",
      data: newFarmer,
    });
  } catch (error: any) {
    console.error("Create farmer error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create farmer",
      error: error.message || "Internal server error",
    });
  }
};

export const getFarmers = async (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response,
) => {
  try {
    const {
      page = "1",
      limit = "10",
      cropName,
      state,
      district,
      taluk,
      village,
      paymentType,
      droneSprayingConsent,
      agronomistCareConsent,
      search,
    } = req.query;

    const query: Record<string, any> = {};

    // Location filters
    if (state) query.state = state;
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (village) query.village = village;

    // Crop name filter
    if (cropName) {
      query["crops.name"] = cropName;
    }

    // Payment type
    if (paymentType && (paymentType === "cash" || paymentType === "credit")) {
      query["payment.type"] = paymentType;
    }

    // Consent booleans – safe parsing
    const parseBoolean = (val: any) =>
      val === true || val === "true" || val === "1" || val === 1;

    if (droneSprayingConsent !== undefined) {
      query["droneSprayingConsent.value"] = parseBoolean(droneSprayingConsent);
    }

    if (agronomistCareConsent !== undefined) {
      query["agronomistCareConsent.value"] = parseBoolean(
        agronomistCareConsent,
      );
    }

    // Text search – with length limit to prevent ReDoS
    if (search && typeof search === "string" && search.trim()) {
      const safeTerm = search.trim().slice(0, 120);
      query.$or = [
        { name: { $regex: safeTerm, $options: "i" } },
        { phone: { $regex: safeTerm, $options: "i" } },
      ];
    }

    // Pagination – safe numbers
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(limit) || 10));

    const [farmers, total] = await Promise.all([
      Farmer.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Farmer.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: farmers,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Get farmers error:", error);

    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameter format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch farmers",
      error: error.message || "Internal server error",
    });
  }
};
// ────────────────────────────────────────────────
// UPDATE - Update farmer by ID
// ────────────────────────────────────────────────

export const updateFarmer = async (
  req: Request<{ id: string }, {}, UpdateFarmerBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid farmer ID" });
    }

    const updateData = { ...req.body };

    // Handle phone change carefully (prevent duplicates)
    if (updateData.phone !== undefined) {
      const normalized = String(updateData.phone).trim().replace(/\D/g, "");
      const duplicate = await Farmer.findOne({
        phone: normalized,
        _id: { $ne: new Types.ObjectId(id) },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Phone number already in use by another farmer",
        });
      }

      updateData.phone = normalized;
    }

    // Normalize consents if boolean was sent
    if (typeof updateData.droneSprayingConsent === "boolean") {
      updateData.droneSprayingConsent = {
        value: updateData.droneSprayingConsent,
      };
    }
    if (typeof updateData.agronomistCareConsent === "boolean") {
      updateData.agronomistCareConsent = {
        value: updateData.agronomistCareConsent,
      };
    }

    const updated = await Farmer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      lean: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    return res.json({
      success: true,
      message: "Farmer updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update farmer error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update farmer",
      error: error.message || "Internal server error",
    });
  }
};

// getFarmersOnboardedByUser
export const getFarmersOnboardedByUser = async (
  req: Request<{ userId: string }, {}, {}, { page?: string; limit?: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const { page = "1", limit = "10" } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // Safe pagination values
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (pageNum - 1) * pageSize;

    const filter = {
      onboardedBy: new mongoose.Types.ObjectId(userId),
    };

    const [farmers, total] = await Promise.all([
      Farmer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Farmer.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      userId,
      data: farmers,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Get farmers onboarded by user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch farmers",
      error: error.message || "Internal server error",
    });
  }
};
