import { RequestHandler } from "express";
import { AppError } from "../config/AppError";

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (req.userRole !== "admin") {
    next(new AppError(403, "Admin access required"));
    return;
  }
  next();
};