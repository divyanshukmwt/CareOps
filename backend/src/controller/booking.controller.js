import Booking from "../models/booking.models.js";
import Contact from "../models/contact.models.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import Form from "../models/form.models.js";
import BookingForm from "../models/bookingForm.models.js";
import { generateICS } from "../utils/ics.util.js";
import { io } from "../index.js";

export const createBooking = async (req, res) => {
  try {
    const {
      workspaceId,
      name,
      email,
      serviceName,
      scheduledAt,
      durationMinutes,
    } = req.body;

    if (!workspaceId || !name || !email || !serviceName || !scheduledAt) {
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
      durationMinutes,
    });

    await Message.create({
      conversationId: conversation._id,
      sender: "SYSTEM",
      content: `Your booking for "${serviceName}" has been confirmed.`,
      channel: "INTERNAL",
    });

    const forms = await Form.find({ workspaceId });

    for (const form of forms) {
      const bookingForm = await BookingForm.create({
        bookingId: booking._id,
        formId: form._id,
      });

      await Message.create({
        conversationId: conversation._id,
        sender: "SYSTEM",
        content: `Please complete the form: ${form.title}\nForm Link: http://localhost:3000/form/${bookingForm.publicId}`,
        channel: "INTERNAL",
      });
    }

    io.to(workspaceId.toString()).emit("dashboard:update");

    const icsContent = await generateICS({
      bookingId: booking._id.toString(),
      title: serviceName,
      description: `Booking for ${name} (${email})`,
      startDate: new Date(scheduledAt),
      durationMinutes: durationMinutes || 60,
    });

    res.status(201).json({
      message: "Booking confirmed",
      booking,
      calendar: {
        filename: `booking-${booking._id}.ics`,
        content: icsContent,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
