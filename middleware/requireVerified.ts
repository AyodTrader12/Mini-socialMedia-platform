import { RequestHandler } from "express";
import { AppError } from "../config/AppError";
import { user } from "../model/userModel";


export const requireVerified: RequestHandler = async (req, _res, next) => {
  const verifiedUser: any = await user.findById(req.userId).select("isVerified");

  if (!verifiedUser) {
    next(new AppError(401, "Account no longer exists"));
    return;
  }
  if (!verifiedUser.isVerified) {
    next(new AppError(403, "Please verify your email first"));
    return;
  }
  next();
};