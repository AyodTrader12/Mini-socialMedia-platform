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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarPublicId = void 0;
exports.uploadBuffer = uploadBuffer;
exports.deleteAsset = deleteAsset;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const AppError_1 = require("../config/AppError");
const avatarPublicId = (userId) => `mini-social/avatars/${userId}`;
exports.avatarPublicId = avatarPublicId;
function uploadBuffer(buffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream(options, (error, result) => {
            if (error || !result) {
                console.error("Cloudinary upload failed:", error);
                // 400 = Cloudinary rejected the file itself, anything else = their service/our config
                const status = (error === null || error === void 0 ? void 0 : error.http_code) === 400 ? 400 : 502;
                const message = status === 400 ? "The uploaded file is invalid" : "Upload failed, please try again";
                reject(new AppError_1.AppError(status, message));
                return;
            }
            resolve(result);
        });
        stream.end(buffer);
    });
}
function deleteAsset(publicId_1) {
    return __awaiter(this, arguments, void 0, function* (publicId, resourceType = "image") {
        yield cloudinary_1.default.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });
    });
}
