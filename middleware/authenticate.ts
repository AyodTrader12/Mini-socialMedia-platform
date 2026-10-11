import { RequestHandler } from "express";
import { AppError } from "../config/AppError";
import { verifyToken } from "../utils/jwt";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  const token = header.slice(7);
  req.userId = verifyToken(token);
  next();
};