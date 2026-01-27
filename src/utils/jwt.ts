import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, accessSecret, {
    expiresIn: "60m",
  });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });
};

export const verifyRefresh = (token: string) => {
  return jwt.verify(token, refreshSecret) as { id: string; role?: string };
};
