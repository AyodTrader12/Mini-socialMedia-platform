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
exports.assertValidPost = assertValidPost;
exports.uploadPostMedia = uploadPostMedia;
exports.deletePostMedia = deletePostMedia;
const limits_1 = require("../config/limits");
const AppError_1 = require("../config/AppError");
const upload_service_1 = require("./upload.service");
// export async function uploadPostMedia(files: Express.Multer.File[]): Promise<PostMedia[]> {
//   if (files.length === 0) return [];
//   // ...rest unchanged
// }
const isVideo = (file) => file.mimetype.startsWith("video/");
/** Enforces: at least 1 file, and either all images (each within size) or exactly one video. */
/** A post needs a caption or media. Media, if present, is either all images or exactly one video. */
function assertValidPost(caption, files) {
    if (files.length === 0) {
        if (!(caption === null || caption === void 0 ? void 0 : caption.trim())) {
            throw new AppError_1.AppError(400, "Write something or attach an image or video");
        }
        return;
    }
    const hasVideo = files.some(isVideo);
    if (hasVideo) {
        if (files.length > 1) {
            throw new AppError_1.AppError(400, "A post can have one video or up to 10 images, not both");
        }
        return;
    }
    for (const file of files) {
        if (file.size > limits_1.LIMITS.imageSize) {
            throw new AppError_1.AppError(400, "Each image must be 5MB or smaller");
        }
    }
}
function uploadOne(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const video = isVideo(file);
        const result = yield (0, upload_service_1.uploadBuffer)(file.buffer, Object.assign({ folder: "mini-social/posts", resource_type: video ? "video" : "image" }, (video ? {} : { transformation: [{ width: 1600, crop: "limit", quality: "auto" }] })));
        return {
            url: result.secure_url,
            publicId: result.public_id,
            type: video ? "video" : "image",
            width: result.width,
            height: result.height,
        };
    });
}
/** Uploads all files in parallel. If any fails, deletes the ones that succeeded and throws. */
function uploadPostMedia(files) {
    return __awaiter(this, void 0, void 0, function* () {
        if (files.length === 0)
            return [];
        const results = yield Promise.allSettled(files.map(uploadOne));
        const uploaded = [];
        let failure = null;
        for (const result of results) {
            if (result.status === "fulfilled")
                uploaded.push(result.value);
            else
                failure !== null && failure !== void 0 ? failure : (failure = result.reason);
        }
        if (failure) {
            yield deletePostMedia(uploaded);
            throw failure;
        }
        return uploaded;
    });
}
function deletePostMedia(media) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.allSettled(media.map((m) => (0, upload_service_1.deleteAsset)(m.publicId, m.type)));
    });
}
