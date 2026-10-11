import { env } from "../config/env";
import transporter from "../utils/mailer";

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

export async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
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
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}
