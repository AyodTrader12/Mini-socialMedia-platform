"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
if (!env_1.env.EMAIL_FROM ||
    !env_1.env.GOOGLE_CLIENT_ID ||
    !env_1.env.GOOGLE_CLIENT_SECRET ||
    !env_1.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("Missing required email configuration in environment variables");
}
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        type: "oAuth2",
        user: env_1.env.EMAIL_FROM,
        clientId: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        refreshToken: env_1.env.GOOGLE_REFRESH_TOKEN,
    }
});
exports.default = transporter;
