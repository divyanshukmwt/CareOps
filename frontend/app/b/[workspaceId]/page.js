import Booking from "../models/booking.models.js";
import Contact from "../models/contact.models.js";
import BookingForm from "../models/bookingForm.models.js";
import Inventory from "../models/inventory.models.js";
import BookingInventory from "../models/bookingInventory.models.js";

/* ================= SLOT RULE ================= */
const START_HOUR = 10;
const END_HOUR = 18;
const ALLOWED_DAYS = [1, 2, 3, 4, 5]; // Mon–Fri

const isValidWorkingTime = (date) => {
  const day = date.getDay();
  const hour = date.getHours();
  return ALLOWED_DAYS.includes(day) && hour >= START_HOUR && hour < END_HOUR;
};

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    const {
      workspaceId: bodyWorkspaceId,
      name,
      email,
      serviceName,
      scheduledAt,
      formId,
      source = "PUBLIC",
    } = req.body;

    const workspaceId =
      source === "ADMIN" ? req.user?.workspaceId : bodyWorkspaceId;

    if (!workspaceId || !name || !email || !serviceName || !scheduledAt || !formId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const date = new Date(scheduledAt);
    if (!isValidWorkingTime(date)) {
      return res.status(400).json({
        message: "Bookings allowed Mon–Fri between 10:00 AM – 6:00 PM",
      });
    }

    let contact = await Contact.findOne({ workspaceId, email });
    if (!contact) {
      contact = await Contact.create({ workspaceId, name, email });
    }

    const booking = await Booking.create({
      workspaceId,
      contactId: contact._id,
      serviceName,
      scheduledAt: date,
      source,
      status: "PENDING",
    });

    await BookingForm.create({
      bookingId: booking._id,
      formId,
    });

    res.status(201).json({ message: "Booking created", booking });
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
        title: f.formId.title,
        status: f.status,
        responses: f.responseData || {},
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
    if (!booking) return res.status(404).json({ message: "Booking not found" });

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
