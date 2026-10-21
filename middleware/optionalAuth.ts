import { RequestHandler } from "express";
import { user } from "../model/userModel";
import { verifyToken } from "../utils/jwt";


export const optionalAuth: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    try {
      const userId = verifyToken(header.slice(7));
      const User = await user.findById(userId).select("role isSuspended");
      if (User && !User.isSuspended) {
        req.userId = User.id;
        req.userRole = User.role as "user" | "admin";
      }
    } catch {
      // Bad or expired token: treat as a visitor so shared links still open
    }
  }

  next();
};