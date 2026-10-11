"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const AppError_1 = require("../config/AppError");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        next(new AppError_1.AppError(401, "Authentication required"));
        return;
    }
    const token = header.slice(7);
    req.userId = (0, jwt_1.verifyToken)(token);
    next();
};
exports.authenticate = authenticate;
