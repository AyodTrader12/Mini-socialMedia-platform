"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const AppError_1 = require("../config/AppError");
const requireAdmin = (req, _res, next) => {
    if (req.userRole !== "admin") {
        next(new AppError_1.AppError(403, "Admin access required"));
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
