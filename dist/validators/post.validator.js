"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const limits_1 = require("../config/limits");
exports.createPostSchema = zod_1.default.object({
    caption: zod_1.default
        .string()
        .trim()
        .max(limits_1.LIMITS.captionLength, `Caption must be at most ${limits_1.LIMITS.captionLength} characters`)
        .optional(),
});
