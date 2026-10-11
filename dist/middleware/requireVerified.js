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
exports.requireVerified = void 0;
const AppError_1 = require("../config/AppError");
const userModel_1 = require("../model/userModel");
const requireVerified = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedUser = yield userModel_1.user.findById(req.userId).select("isVerified");
    if (!verifiedUser) {
        next(new AppError_1.AppError(401, "Account no longer exists"));
        return;
    }
    if (!verifiedUser.isVerified) {
        next(new AppError_1.AppError(403, "Please verify your email first"));
        return;
    }
    next();
});
exports.requireVerified = requireVerified;
