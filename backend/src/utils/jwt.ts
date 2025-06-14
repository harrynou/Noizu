import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors";
export const generateToken = (payload: object): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new UnauthorizedError("Invalid or Expired token");
  }
};
