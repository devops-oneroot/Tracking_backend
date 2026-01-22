import jwt from "jsonwebtoken";

export const signAccessToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.ACCESS_EXPIRE || "15m",
  });

export const signRefreshToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.REFRESH_EXPIRE || "7d",
  });

export const verifyAccess = (token: string) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

export const verifyRefresh = (token: string) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
