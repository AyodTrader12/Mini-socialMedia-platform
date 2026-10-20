"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMediaUpload = exports.avatarUploads = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../config/AppError");
const limits_1 = require("../config/limits");
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
function imageFilter(req, file, cb) {
    if (!IMAGE_TYPES.includes(file.mimetype)) {
        cb(new AppError_1.AppError(400, "only jpeg,png and webp images are allowed"));
        return;
    }
    cb(null, true);
}
exports.avatarUploads = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
    fileFilter: imageFilter,
}).single("avatar");
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
function mediaFilter(_req, file, cb) {
    if (![...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.mimetype)) {
        cb(new AppError_1.AppError(400, "Only JPG, PNG, WebP images and MP4, WebM, MOV videos are allowed"));
        return;
    }
    cb(null, true);
}
exports.postMediaUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: limits_1.LIMITS.videoSize, files: limits_1.LIMITS.maxPostImage },
    fileFilter: mediaFilter,
}).array("media", limits_1.LIMITS.maxPostImage);
