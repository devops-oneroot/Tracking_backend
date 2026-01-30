// import jwt from "jsonwebtoken";
// import User from "../models/User.model.js";

// export const requireAuth = async (req: any, res: any, next: any) => {
//   try {
//     const auth = req.headers.authorization;

//     if (!auth || !auth.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const token = auth.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_ACCESS_SECRET as string,
//     ) as { id: string; role: string };

//     req.user = decoded;

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

interface JwtPayload {
  id: string;
  role: string;
}

export const requireAuth = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    /* 1️⃣ Get Authorization header */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    /* 2️⃣ Extract token */
    const token = authHeader.split(" ")[1];

    /* 3️⃣ Verify access token */
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    /* 4️⃣ OPTIONAL but recommended: check user still exists */
    const user = await User.findById(decoded.id).select("_id role");
    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    /* 5️⃣ Attach user to request */
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    /* 6️⃣ Continue */
    next();
  } catch (err: any) {
    console.error("❌ Auth middleware error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};
