import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking form link to customer email
 */
export const sendBookingEmail = async ({
  to,
  customerName,
  serviceName,
  formLink,
}) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Your booking for ${serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Hello ${customerName},</h2>

          <p>Your booking for <strong>${serviceName}</strong> has been confirmed.</p>

          <p>Please complete the form using the link below:</p>

          <p>
            <a href="${formLink}" target="_blank"
               style="display:inline-block;padding:10px 16px;
                      background:#4f46e5;color:#fff;
                      text-decoration:none;border-radius:6px;">
              Open Booking Form
            </a>
          </p>

          <p style="margin-top:20px;color:#555">
            If you have any questions, just reply to this email.
          </p>

          <p>— CareOps Team</p>
        </div>
      `,
    });

    console.log("📧 Booking email sent to:", to);
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
};
