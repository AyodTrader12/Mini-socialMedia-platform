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
exports.sendEmail = sendEmail;
const env_1 = require("../config/env");
const mailer_1 = __importDefault(require("../utils/mailer"));
// export async function sendEmail(to: string, subject: string, text: string) {
//   if (!transporter) {
//     if (env.NODE_ENV === "production") {
//       throw new Error("SMTP is not configured");
//     }
//     console.log(`\n📧 [DEV EMAIL] To: ${to}\nSubject: ${subject}\n${text}\n`);
//     return;
//   }
//   await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, text });
// }
function sendEmail(to, subject, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield mailer_1.default.sendMail({
                from: env_1.env.EMAIL_FROM,
                to,
                subject,
                text,
            });
            console.log("\n========== OTP EMAIL ==========");
            console.log("Recipient:", to);
            console.log("Subject:", subject);
            console.log("Email content:", text);
            console.log("Message ID:", info.messageId);
            console.log("================================\n");
            console.log("Email sent successfully:", info.messageId);
        }
        catch (error) {
            console.error("Email error:", error);
            throw error;
        }
    });
}
