"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const AppError_1 = require("../config/AppError");
const jwt_1 = require("../utils/jwt");
const userModel_1 = require("../model/userModel");
const authenticate = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw new AppError_1.AppError(401, "Authentication required");
    }
    const userId = (0, jwt_1.verifyToken)(header.slice(7));
    const User = yield userModel_1.user.findById(userId).select("role isSuspended");
    if (!User)
        throw new AppError_1.AppError(401, "Account no longer exists");
    if (User.isSuspended)
        throw new AppError_1.AppError(403, "This account has been suspended");
    req.userId = User.id;
    req.userRole = User.role;
    next();
});
exports.authenticate = authenticate;
