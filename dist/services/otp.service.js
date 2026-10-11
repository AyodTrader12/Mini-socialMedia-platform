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
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
const crypto_1 = __importDefault(require("crypto"));
const mail_service_1 = require("./mail.service");
const env_1 = require("../config/env");
const AppError_1 = require("../config/AppError");
const otp_1 = require("../model/otp");
const OTP_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between codes
const MAX_ATTEMPTS = 5;
const hashCode = (code) => crypto_1.default.createHmac("sha256", env_1.env.JWT_SECRET).update(code).digest("hex");
// randomInt is cryptographically secure. Math.random() is NOT.
const generateCode = () => crypto_1.default.randomInt(0, 1000000).toString().padStart(6, "0");
const EMAIL_COPY = {
    verify: {
        subject: "Verify your Mini Social account",
        intro: "Welcome to Mini Social! Your verification code is:",
    },
    reset: {
        subject: "Reset your Mini Social password",
        intro: "Use this code to reset your password:",
    },
};
/** Returns true if a code was sent, false if blocked by the cooldown. */
function sendOtp(user, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield otp_1.Otp.findOne({ user: user.id, type });
        if (existing && Date.now() - existing.sentAt.getTime() < RESEND_COOLDOWN_MS) {
            return false;
        }
        const code = generateCode();
        yield otp_1.Otp.findOneAndUpdate({ user: user.id, type }, {
            codeHash: hashCode(code),
            attempts: 0,
            sentAt: new Date(),
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
        }, { upsert: true });
        const { subject, intro } = EMAIL_COPY[type];
        yield (0, mail_service_1.sendEmail)(user.email, subject, `${intro}\n\n${code}\n\nIt expires in 10 minutes. If you didn't request this, ignore this email.`);
        return true;
    });
}
/** Throws if the code is wrong, expired or out of attempts. Deletes the code on success. */
function verifyOtp(userId, type, code) {
    return __awaiter(this, void 0, void 0, function* () {
        // Increment attempts atomically BEFORE checking, so parallel guesses can't beat the limit
        const otp = yield otp_1.Otp.findOneAndUpdate({ user: userId, type }, { $inc: { attempts: 1 } }, { new: true });
        if (!otp || otp.expiresAt.getTime() < Date.now()) {
            throw new AppError_1.AppError(400, "Invalid or expired code");
        }
        if (otp.attempts > MAX_ATTEMPTS) {
            yield otp_1.Otp.deleteOne();
            throw new AppError_1.AppError(400, "Too many attempts. Please request a new code");
        }
        const expected = Buffer.from(otp.codeHash);
        const actual = Buffer.from(hashCode(code));
        const valid = expected.length === actual.length && crypto_1.default.timingSafeEqual(expected, actual);
        if (!valid) {
            throw new AppError_1.AppError(400, "Invalid or expired code");
        }
        yield otp.deleteOne();
    });
}
