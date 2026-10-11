import { env } from "../config/env";
import nodemailer from "nodemailer";

if(
    !env.EMAIL_FROM ||
    !env.GOOGLE_CLIENT_ID ||
    !env.GOOGLE_CLIENT_SECRET ||
    !env.GOOGLE_REFRESH_TOKEN 
) {
    throw new Error("Missing required email configuration in environment variables");
}

const transporter = nodemailer.createTransport({
   service:"gmail",
   auth:{
    type:"oAuth2",
    user:env.EMAIL_FROM,
    clientId:env.GOOGLE_CLIENT_ID,
    clientSecret:env.GOOGLE_CLIENT_SECRET,
    refreshToken:env.GOOGLE_REFRESH_TOKEN,
 
   } 
})

export default transporter  