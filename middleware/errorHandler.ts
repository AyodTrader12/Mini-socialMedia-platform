import { ErrorRequestHandler } from "express";
import { AppError } from "../config/AppError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message, details: err.details });
    return;
  }

  // MongoDB duplicate key error (unique index violated)
  if (err?.code === 11000) {
    res.status(409).json({ message: "Duplicate value" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};