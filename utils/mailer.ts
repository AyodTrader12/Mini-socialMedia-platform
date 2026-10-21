import { env } from "../config/env";
import nodemailer from "nodemailer";

if(
    !env.EMAIL_FROM ||
    !env.GOOGLE_KEY 
) {
    throw new Error("Missing required email configuration in environment variables");
}

const transporter = nodemailer.createTransport({
     service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM as string,
      pass: process.env.GOOGLE_KEY as string,
    },
})

export default transporter  