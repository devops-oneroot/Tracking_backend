import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).json({ message: "No token" });

    const token = auth.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    req.user = payload;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
