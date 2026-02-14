import Booking from "../models/booking.models.js";
import Contact from "../models/contact.models.js";
import BookingForm from "../models/bookingForm.models.js";
import Inventory from "../models/inventory.models.js";
import BookingInventory from "../models/bookingInventory.models.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { sendBookingEmail } from "../utils/email.util.js";

/* ================= SLOT RULES ================= */
const START_HOUR = 10;
const END_HOUR = 18;
const ALLOWED_DAYS = [1, 2, 3, 4, 5]; // Mon–Fri

const isValidSlot = (date) => {
  const day = date.getDay();
  const hour = date.getHours();

  if (!ALLOWED_DAYS.includes(day)) return false;
  if (hour < START_HOUR || hour >= END_HOUR) return false;

  return true;
};

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
    } = req.body;

    const workspaceId =
      source === "ADMIN" ? req.user?.workspaceId : req.body.workspaceId;

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

    const date = new Date(scheduledAt);

    if (!isValidSlot(date)) {
      return res.status(400).json({
        message: "Bookings allowed Mon–Fri between 10:00 AM – 6:00 PM",
      });
    }

    /* CONTACT */
    let contact = await Contact.findOne({ workspaceId, email });
    if (!contact) {
      contact = await Contact.create({ workspaceId, name, email });
    }

    /* CONVERSATION */
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

    /* BOOKING */
    const booking = await Booking.create({
      workspaceId,
      contactId: contact._id,
      serviceName,
      scheduledAt: date,
      source,
      status: "PENDING",
    });

    /* BOOKING FORM */
    const bookingForm = await BookingForm.create({
      bookingId: booking._id,
      formId,
    });

    /* FORM LINK */
    const formLink = `${process.env.CLIENT_URL}/form/${bookingForm.publicId}`;

    /* 📧 SEND EMAIL */
    await sendBookingEmail({
      to: email,
      customerName: name,
      serviceName,
      formLink,
    });

    /* 📥 INBOX MESSAGE */
    await Message.create({
      conversationId: conversation._id,
      sender: process.env.SYSTEM_SENDER || "SYSTEM",
      content: `Booking confirmed for "${serviceName}".\nForm link:\n${formLink}`,
      channel: "INTERNAL",
    });

    res.status(201).json({
      message: "Booking created and form sent",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET BOOKING FORMS ================= */
export const getBookingForms = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const forms = await BookingForm.find({ bookingId })
      .populate("formId", "title")
      .sort({ createdAt: 1 });

    res.json(
      forms.map((f) => ({
        formTitle: f.formId.title,
        status: f.status,
        responses: f.responseData || {},
        publicId: f.publicId,
      }))
    );
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= COMPLETE BOOKING ================= */
export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { inventoryUsage = [] } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "COMPLETED";
    await booking.save();

    for (const item of inventoryUsage) {
      if (!item.quantityUsed || item.quantityUsed <= 0) continue;

      await BookingInventory.create({
        bookingId,
        inventoryId: item.inventoryId,
        quantityUsed: item.quantityUsed,
      });

      const inv = await Inventory.findById(item.inventoryId);
      inv.quantityAvailable -= item.quantityUsed;
      await inv.save();
    }

    res.json({ message: "Booking completed" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

