import { Resend } from "resend";

let resendClient = null;

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not set – emails will be skipped");
    return null;
  }

  if (!resendClient) {
    console.log("📧 Initializing Resend client");
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
};

export const sendEmailSafe = async ({ to, subject, html }) => {
  try {
    const resend = getResend();
    if (!resend) {
      console.warn("📧 sendEmailSafe skipped because Resend client is not configured");
      return;
    }

    console.log(`📧 Sending email to: ${to} | subject: ${subject}`);

    const res = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("📧 Email send response:", res);
    return res;
  } catch (err) {
    console.error("❌ Email send failed:", err && err.message ? err.message : err);
    throw err;
  }
};

// Log environment variables useful for debugging email issues
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
