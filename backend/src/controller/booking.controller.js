// booking.controller.js
import Booking from "../models/booking.models.js";
import Contact from "../models/contact.models.js";
import BookingForm from "../models/bookingForm.models.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { sendEmailSafe } from "../utils/email.util.js";

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      serviceName,
      scheduledAt,
      source = "PUBLIC",
      formId,
      workspaceId: bodyWorkspaceId,
    } = req.body;

    const workspaceId =
      source === "ADMIN" ? req.user?.workspaceId : bodyWorkspaceId;

    if (!workspaceId || !name || !email || !serviceName || !scheduledAt || !formId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let contact = await Contact.findOne({ workspaceId, email });
    if (!contact) {
      contact = await Contact.create({ workspaceId, name, email });
    }

    let conversation = await Conversation.findOne({
      workspaceId,
      contactId: contact._id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        workspaceId,
        contactId: contact._id,
      });
    }

    const booking = await Booking.create({
      workspaceId,
      contactId: contact._id,
      serviceName,
      scheduledAt,
      source,
      status: "PENDING",
    });

    const bookingForm = await BookingForm.create({
      bookingId: booking._id,
      formId,
    });

    const formLink = `${process.env.CLIENT_URL}/form/${bookingForm.publicId}`;

    await sendEmailSafe({
      to: email,
      subject: `Your booking for ${serviceName}`,
      html: `
        <h2>Hello ${name},</h2>
        <p>Your booking is confirmed.</p>
        <p>Form link:</p>
        <a href="${formLink}">${formLink}</a>
      `,
    });

    await Message.create({
      conversationId: conversation._id,
      sender: process.env.SYSTEM_SENDER || "SYSTEM",
      content: `Booking created. Form link:\n${formLink}`,
      channel: "INTERNAL",
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET BOOKING FORMS (MISSING BEFORE) ================= */
export const getBookingForms = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const forms = await BookingForm.find({ bookingId })
      .populate("formId", "title")
      .sort({ createdAt: 1 });

    res.json(
      forms.map((f) => ({
        formTitle: f.formId.title,
        responses: f.responseData || {},
        publicId: f.publicId,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
