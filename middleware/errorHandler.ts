import { ErrorRequestHandler } from "express";
import { AppError } from "../config/AppError";
import { MulterError } from "multer";


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

  if(err instanceof MulterError){
    const tooLarge = err.code === "LIMIT_FILE_SIZE"
    const message  = tooLarge
    ? "File is too large"
    : err.code === "LIMIT_UNEXPECTED_FILE"
    ? ` unexpected file field: ${err.field}`
    : err.message
    res.status(tooLarge ? 400 :413).json({message})
    return 
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};