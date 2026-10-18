import { RequestHandler } from "express";
import { AppError } from "../config/AppError";
import { verifyToken } from "../utils/jwt";
import { user } from "../model/userModel";
export const authenticate: RequestHandler = async (req, _res, next) => {
 const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const userId = verifyToken(header.slice(7));

  const User = await user.findById(userId).select("role isSuspended");
  if (!User) throw new AppError(401, "Account no longer exists");
  if (User.isSuspended) throw new AppError(403, "This account has been suspended");

  req.userId = User.id;
  req.userRole = User.role as "user" | "admin";
  next();
};