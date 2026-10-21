"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
if (!env_1.env.EMAIL_FROM ||
    !env_1.env.GOOGLE_KEY) {
    throw new Error("Missing required email configuration in environment variables");
}
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.GOOGLE_KEY,
    },
});
exports.default = transporter;
