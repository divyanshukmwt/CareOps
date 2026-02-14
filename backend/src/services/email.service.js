import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking form link to customer
 */
export const sendBookingFormEmail = async ({
  to,
  customerName,
  serviceName,
  formLink,
  workspaceName = "CareOps",
}) => {
  try {
    await resend.emails.send({
      from: "CareOps <onboarding@resend.dev>",
      to,
      subject: `Complete your booking form – ${workspaceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Hello ${customerName},</h2>

          <p>
            Your booking for <strong>${serviceName}</strong> has been confirmed.
          </p>

          <p>
            Please complete the required form using the link below:
          </p>

          <p style="margin: 20px 0">
            <a
              href="${formLink}"
              style="
                background: #4f46e5;
                color: #ffffff;
                padding: 12px 18px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              "
            >
              Fill Booking Form
            </a>
          </p>

          <p>
            If the button doesn’t work, copy and paste this link:
          </p>

          <p style="word-break: break-all">${formLink}</p>

          <br />
          <p>Thanks,<br />${workspaceName} Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};
