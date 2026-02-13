import Booking from "../models/booking.models.js";
import Contact from "../models/contact.models.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import BookingForm from "../models/bookingForm.models.js";
import { io } from "../index.js";

/* ===============================
   CREATE BOOKING (PUBLIC)
================================ */
export const createBooking = async (req, res) => {
  try {
    const {
      workspaceId,
      name,
      email,
      serviceName,
      scheduledAt,
      durationMinutes,
      formId, // ✅ SELECTED FORM
    } = req.body;

    if (
      !workspaceId ||
      !name ||
      !email ||
      !serviceName ||
      !scheduledAt ||
      !formId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 Find or create contact
    let contact = await Contact.findOne({ workspaceId, email });
    if (!contact) {
      contact = await Contact.create({ workspaceId, name, email });
    }

    // 🔹 Find or create conversation
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

    // 🔹 Create booking
    const booking = await Booking.create({
      workspaceId,
      contactId: contact._id,
      serviceName,
      scheduledAt,
      durationMinutes,
    });

    // 🔹 Attach ONLY selected form
    const bookingForm = await BookingForm.create({
      bookingId: booking._id,
      formId,
    });

    // 🔹 Send message with form link
    await Message.create({
      conversationId: conversation._id,
      sender: "SYSTEM",
      content: `Your booking for "${serviceName}" is confirmed.\nPlease complete the form:\nhttp://localhost:3000/form/${bookingForm.publicId}`,
      channel: "INTERNAL",
    });

    io.to(workspaceId.toString()).emit("dashboard:update");

    res.status(201).json({
      message: "Booking confirmed",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   GET BOOKING FORMS (ADMIN)
================================ */
export const getBookingForms = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingForms = await BookingForm.find({ bookingId })
      .populate("formId", "title fields")
      .sort({ createdAt: 1 });

    const result = bookingForms.map((bf) => ({
      bookingFormId: bf._id,
      formTitle: bf.formId.title,
      status: bf.status,
      submittedAt: bf.submittedAt,
      responses: bf.responseData || {},
    }));

    res.json(result);
  } catch (error) {
    console.error("Get booking forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
