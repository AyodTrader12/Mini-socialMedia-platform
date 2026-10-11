"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = require("../config/AppError");
function signToken(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId }, env_1.env.JWT_SECRET, { expiresIn: `${env_1.env.JWT_EXPIRES_IN_DAYS}d` });
}
function verifyToken(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (typeof payload === "string" || !payload.sub) {
            throw new Error("Bad payload");
        }
        return payload.sub;
    }
    catch (_a) {
        throw new AppError_1.AppError(401, "Invalid or expired token");
    }
}
