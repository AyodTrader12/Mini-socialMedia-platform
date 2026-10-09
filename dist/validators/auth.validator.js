"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    userName: zod_1.default
        .string()
        .trim()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" })
        .regex(/^[a-z0-9]+$/, { message: "only letters,numbers and underscore are allowed" }),
    email: zod_1.default
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),
    password: zod_1.default
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(72, { message: "Password must be at most 72 characters long" })
});
