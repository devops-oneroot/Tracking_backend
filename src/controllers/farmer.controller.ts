// import { Request, Response } from "express";
// import Farmer from "../models/Farmer.model.js";

// /* ================= ONBOARD FARMER ================= */

// export const createFarmer = async (req: Request, res: Response) => {
//   try {
//     const {
//       name,
//       phone,
//       crops, // ✅ array of crops

//       state,
//       district,
//       taluk,
//       village,
//       landSize,

//       inputSupplier,
//       additionalInfo,

//       payment, // ✅ { type, additionalInfo }
//       droneSprayingConsent, // ✅ { value, additionalInfo }
//       agronomistCareConsent, // ✅ { value, additionalInfo }

//       location,
//       photo,
//     } = req.body;

//     if (!name || !phone || !Array.isArray(crops) || crops.length === 0) {
//       return res.status(400).json({
//         message: "Name, phone and at least one crop are required",
//       });
//     }

//     const exists = await Farmer.findOne({ phone });
//     if (exists) {
//       return res.status(409).json({ message: "Farmer already exists" });
//     }

//     const farmer = await Farmer.create({
//       name,
//       phone,
//       crops,
//       state,
//       district,
//       taluk,
//       village,
//       landSize,
//       inputSupplier,
//       additionalInfo,
//       payment,
//       droneSprayingConsent,
//       agronomistCareConsent,
//       location,
//       photo,
//     });

//     res.status(201).json({
//       message: "Farmer onboarded successfully",
//       farmer,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to onboard farmer",
//       error,
//     });
//   }
// };

// /* ================= FETCH FARMERS (DASHBOARD) ================= */

// export const getFarmers = async (req: Request, res: Response) => {
//   try {
//     const {
//       page = "1",
//       limit = "10",

//       cropName, // ✅ changed
//       state,
//       district,
//       taluk,
//       village,

//       paymentType,
//       droneSprayingConsent,
//       agronomistCareConsent,

//       search,
//     } = req.query;

//     const query: any = {};

//     /* ===== BASIC FILTERS ===== */
//     if (state) query.state = state;
//     if (district) query.district = district;
//     if (taluk) query.taluk = taluk;
//     if (village) query.village = village;

//     /* ===== CROP FILTER ===== */
//     if (cropName) {
//       query["crops.name"] = cropName;
//     }

//     /* ===== PAYMENT FILTER ===== */
//     if (paymentType) {
//       query["payment.type"] = paymentType;
//     }

//     /* ===== CONSENT FILTERS ===== */
//     if (droneSprayingConsent !== undefined) {
//       query["droneSprayingConsent.value"] = droneSprayingConsent === "true";
//     }

//     if (agronomistCareConsent !== undefined) {
//       query["agronomistCareConsent.value"] = agronomistCareConsent === "true";
//     }

//     /* ===== SEARCH ===== */
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//       ];
//     }

//     const pageNumber = Number(page);
//     const pageSize = Number(limit);

//     const [farmers, total] = await Promise.all([
//       Farmer.find(query)
//         .sort({ createdAt: -1 })
//         .skip((pageNumber - 1) * pageSize)
//         .limit(pageSize),

//       Farmer.countDocuments(query),
//     ]);

//     res.json({
//       data: farmers,
//       total,
//       page: pageNumber,
//       totalPages: Math.ceil(total / pageSize),
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch farmers",
//       error,
//     });
//   }
// };

// export const updateFarmer = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       phone,
//       crops,

//       state,
//       district,
//       taluk,
//       village,
//       landSize,

//       inputSupplier,
//       additionalInfo,
//       payment,
//       droneSprayingConsent,
//       agronomistCareConsent,

//       location,
//       photo,
//     } = req.body;

//     const updatePayload: any = {};

//     if (name !== undefined) updatePayload.name = name;
//     if (phone !== undefined) updatePayload.phone = phone;
//     if (crops !== undefined) updatePayload.crops = crops;

//     if (state !== undefined) updatePayload.state = state;
//     if (district !== undefined) updatePayload.district = district;
//     if (taluk !== undefined) updatePayload.taluk = taluk;
//     if (village !== undefined) updatePayload.village = village;
//     if (landSize !== undefined) updatePayload.landSize = landSize;

//     if (inputSupplier !== undefined)
//       updatePayload.inputSupplier = inputSupplier;

//     if (additionalInfo !== undefined)
//       updatePayload.additionalInfo = additionalInfo;

//     if (payment !== undefined) updatePayload.payment = payment;
//     if (droneSprayingConsent !== undefined)
//       updatePayload.droneSprayingConsent = droneSprayingConsent;
//     if (agronomistCareConsent !== undefined)
//       updatePayload.agronomistCareConsent = agronomistCareConsent;

//     if (location !== undefined) updatePayload.location = location;
//     if (photo !== undefined) updatePayload.photo = photo;

//     const farmer = await Farmer.findByIdAndUpdate(id, updatePayload, {
//       new: true,
//       runValidators: true,
//     });

//     if (!farmer) {
//       return res.status(404).json({ message: "Farmer not found" });
//     }

//     res.json({
//       message: "Farmer updated successfully",
//       farmer,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update farmer",
//       error,
//     });
//   }
// };

// controllers/farmer.controller.ts
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Farmer, { IFarmer } from "../models/Farmer.model.js";

// ────────────────────────────────────────────────
// Helper Types
// ────────────────────────────────────────────────

interface CreateFarmerBody {
  name: string;
  phone: string;
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

// ────────────────────────────────────────────────
// CREATE - Onboard new farmer
// ────────────────────────────────────────────────

export const createFarmer = async (
  req: Request<{}, {}, CreateFarmerBody>,
  res: Response,
) => {
  try {
    const {
      name,
      phone,
      crops = [],
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

// ────────────────────────────────────────────────
// READ - List farmers with filters & pagination
// ────────────────────────────────────────────────

// export const getFarmers = async (
//   req: Request<{}, {}, {}, PaginationQuery>,
//   res: Response,
// ) => {
//   try {
//     const {
//       page = "1",
//       limit = "10",
//       cropName,
//       state,
//       district,
//       taluk,
//       village,
//       paymentType,
//       droneSprayingConsent,
//       agronomistCareConsent,
//       search,
//     } = req.query;

//     const query: Record<string, any> = {};

//     if (state) query.state = state;
//     if (district) query.district = district;
//     if (taluk) query.taluk = taluk;
//     if (village) query.village = village;

//     if (cropName) query["crops.name"] = cropName;

//     if (paymentType && (paymentType === "cash" || paymentType === "credit")) {
//       query["payment.type"] = paymentType;
//     }

//     if (droneSprayingConsent !== undefined) {
//       query["droneSprayingConsent.value"] =
//         droneSprayingConsent === "true" || droneSprayingConsent === true;
//     }

//     if (agronomistCareConsent !== undefined) {
//       query["agronomistCareConsent.value"] =
//         agronomistCareConsent === "true" || agronomistCareConsent === true;
//     }

//     if (search && typeof search === "string" && search.trim()) {
//       query.$or = [
//         { name: { $regex: search.trim(), $options: "i" } },
//         { phone: { $regex: search.trim(), $options: "i" } },
//       ];
//     }

//     const pageNum = Math.max(1, Number(page));
//     const pageSize = Math.min(50, Math.max(1, Number(limit)));

//     const [farmers, total] = await Promise.all([
//       Farmer.find(query)
//         .sort({ createdAt: -1 })
//         .skip((pageNum - 1) * pageSize)
//         .limit(pageSize)
//         .lean(),
//       Farmer.countDocuments(query),
//     ]);

//     return res.json({
//       success: true,
//       data: farmers,
//       pagination: {
//         page: pageNum,
//         limit: pageSize,
//         total,
//         totalPages: Math.ceil(total / pageSize),
//       },
//     });
//   } catch (error: any) {
//     console.error("Get farmers error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch farmers",
//       error: error.message || "Internal server error",
//     });
//   }
// };

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
