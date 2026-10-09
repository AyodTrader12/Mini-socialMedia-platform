"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../config/AppError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({ message: err.message, details: err.details });
        return;
    }
    // MongoDB duplicate key error (unique index violated)
    if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        res.status(409).json({ message: "Duplicate value" });
        return;
    }
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
};
exports.errorHandler = errorHandler;
