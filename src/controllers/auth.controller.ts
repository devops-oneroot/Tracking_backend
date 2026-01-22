import { Request, Response } from "express";
import User from "../models/User.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefresh,
} from "../utils/jwt.js";

// ✅ LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ message: "Phone required" });

    const user = await User.findOne({ phone });

    if (!user)
      return res.status(404).json({ message: "User not found, register" });

    const payload = { id: user._id, role: user.role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.json({ accessToken, refreshToken, user });
  } catch (e: any) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ REFRESH
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const payload: any = verifyRefresh(refreshToken);

    const newAccessToken = signAccessToken({
      id: payload.id,
      role: payload.role,
    });

    res.json({ accessToken: newAccessToken });
  } catch (e) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
