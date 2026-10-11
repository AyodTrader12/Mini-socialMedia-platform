import crypto from "crypto";
import { sendEmail } from "./mail.service";
import { env } from "../config/env";
import { AppError } from "../config/AppError";
import { Otp } from "../model/otp";

export type OtpType = "verify" | "reset";


const OTP_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between codes
const MAX_ATTEMPTS = 5;


const hashCode = (code: string) =>
  crypto.createHmac("sha256", env.JWT_SECRET).update(code).digest("hex");

// randomInt is cryptographically secure. Math.random() is NOT.
const generateCode = () =>
  crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

const EMAIL_COPY: Record<OtpType, { subject: string; intro: string }> = {
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
export async function sendOtp(
  user: { id: string; email: string },
  type: OtpType
): Promise<boolean> {
  const existing = await Otp.findOne({ user: user.id, type });
  if (existing && Date.now() - existing.sentAt.getTime() < RESEND_COOLDOWN_MS) {
    return false;
  }

  const code = generateCode();

  await Otp.findOneAndUpdate(
    { user: user.id, type },
    {
      codeHash: hashCode(code),
      attempts: 0,
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
    { upsert: true }
  );

  const { subject, intro } = EMAIL_COPY[type];
  await sendEmail(
    user.email,
    subject,
    `${intro}\n\n${code}\n\nIt expires in 10 minutes. If you didn't request this, ignore this email.`
  );
  return true;
}

/** Throws if the code is wrong, expired or out of attempts. Deletes the code on success. */
export async function verifyOtp(userId: string, type: OtpType, code: string) {
  // Increment attempts atomically BEFORE checking, so parallel guesses can't beat the limit
  const otp = await Otp.findOneAndUpdate(
    { user: userId, type },
    { $inc: { attempts: 1 } },
    { new: true }
  );

  if (!otp || otp.expiresAt.getTime() < Date.now()) {
    throw new AppError(400, "Invalid or expired code");
  }

  if (otp.attempts > MAX_ATTEMPTS) {
    await Otp.deleteOne();
    throw new AppError(400, "Too many attempts. Please request a new code");
  }

  const expected = Buffer.from(otp.codeHash);
  const actual = Buffer.from(hashCode(code));
  const valid =
    expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

  if (!valid) {
    throw new AppError(400, "Invalid or expired code");
  }

  await otp.deleteOne();
}