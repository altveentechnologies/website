import "server-only";

import nodemailer from "nodemailer";

const SMTP_SERVER = process.env.SMTP_SERVER ?? "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SENDER_EMAIL = process.env.SENDER_EMAIL ?? "";
const SENDER_PASSWORD = process.env.SENDER_PASSWORD ?? "";
const RECEIVER_EMAIL =
  process.env.RECEIVER_EMAIL ?? "altveentechnologies@gmail.com";

/**
 * Fire off a notification email. Never throws: a mail outage should not cost
 * us the lead, which is already persisted in Supabase by the time we get here.
 */
export async function sendNotificationEmail(
  subject: string,
  lines: string[],
): Promise<void> {
  if (!SENDER_EMAIL || !SENDER_PASSWORD) {
    console.warn("[mail] SMTP not configured, skipping:", subject);
    return;
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SENDER_EMAIL, pass: SENDER_PASSWORD },
    });

    await transport.sendMail({
      from: SENDER_EMAIL,
      to: RECEIVER_EMAIL,
      subject,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("[mail] send failed:", error);
  }
}
