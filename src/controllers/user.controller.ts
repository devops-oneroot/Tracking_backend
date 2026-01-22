import User from "../models/User.model.js";
import { Request, Response } from "express";

// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (error: any) {
//     if (error.code === 11000) {
//       return res.status(409).json({
//         message: "User with this phone number already exists",
//       });
//     }

//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // ✅ LOGIN
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { phone } = req.body;

//     if (!phone) {
//       return res.status(400).json({ message: "Phone number required" });
//     }

//     console.log("🔐 Login request:", phone);

//     const user = await User.findOne({ phone });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found, please register",
//       });
//     }

//     res.json(user);
//   } catch (error: any) {
//     console.error("❌ Login error:", error);

//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// export const verifyUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     console.log("🔍 Verifying user:", id);

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ valid: false });
//     }

//     res.json({ valid: true, user });
//   } catch (e: any) {
//     console.error("❌ Verify error:", e);
//     res.status(500).json({ valid: false });
//   }
// };

// // ✅ GET USER BY ID (FOR PROFILE)
// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     console.log("👤 Get user profile:", id);

//     const user = await User.findById(id).select("-__v");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error: any) {
//     console.error("❌ Get user error:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// ✅ REGISTER
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User with this phone number already exists",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ PROFILE (JWT)
export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (e) {
    console.error("Profile error:", e);
    res.status(500).json({ message: "Profile fetch failed" });
  }
};

// ✅ GET USER BY ID (ADMIN / DEBUG)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
