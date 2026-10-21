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
exports.optionalAuth = void 0;
const userModel_1 = require("../model/userModel");
const jwt_1 = require("../utils/jwt");
const optionalAuth = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (header === null || header === void 0 ? void 0 : header.startsWith("Bearer ")) {
        try {
            const userId = (0, jwt_1.verifyToken)(header.slice(7));
            const User = yield userModel_1.user.findById(userId).select("role isSuspended");
            if (User && !User.isSuspended) {
                req.userId = User.id;
                req.userRole = User.role;
            }
        }
        catch (_a) {
            // Bad or expired token: treat as a visitor so shared links still open
        }
    }
    next();
});
exports.optionalAuth = optionalAuth;
