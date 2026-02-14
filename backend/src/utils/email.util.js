import { Resend } from "resend";

let resendClient = null;

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not set – emails will be skipped");
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
};

export const sendEmailSafe = async ({ to, subject, html }) => {
  try {
    const resend = getResend();
    if (!resend) return;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};
