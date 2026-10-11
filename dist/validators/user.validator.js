"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const auth_validator_1 = require("./auth.validator");
exports.updateProfileSchema = zod_1.default
    .object({
    username: auth_validator_1.userNameRule.optional(),
    fullName: zod_1.default.string().trim().max(50, "Name is too long").optional(),
    bio: zod_1.default.string().trim().max(160, "Bio must be at most 160 characters").optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
});
