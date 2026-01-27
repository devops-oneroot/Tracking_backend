import User from "../models/User.model.js";
import { Request, Response } from "express";

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

export const saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Token required" });

    await User.findByIdAndUpdate(userId, { fcmToken: token });

    res.json({ ok: true });
  } catch (err) {
    console.error("FCM SAVE ERROR:", err);
    res.status(500).json({ message: "Failed to save token" });
  }
};
