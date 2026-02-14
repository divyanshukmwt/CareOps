import Booking from "../models/booking.models.js";
import Inventory from "../models/inventory.models.js";
import BookingInventory from "../models/bookingInventory.models.js";

export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { inventoryUsage = [] } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["COMPLETED", "NO_SHOW"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking already closed" });
    }

    booking.status = "COMPLETED";
    await booking.save();

    for (const { inventoryId, quantityUsed } of inventoryUsage) {
      if (!quantityUsed || quantityUsed <= 0) continue;

      await BookingInventory.create({
        bookingId,
        inventoryId,
        quantityUsed,
      });

      const item = await Inventory.findById(inventoryId);
      item.quantityAvailable -= quantityUsed;
      await item.save();
    }

    res.json({ message: "Booking completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const markNoShow = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["COMPLETED", "NO_SHOW"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking already closed" });
    }

    booking.status = "NO_SHOW";
    await booking.save();

    res.json({ message: "Marked as no-show" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookings = async (req, res) => {
  const bookings = await Booking.find({ workspaceId: req.user.workspaceId })
    .populate("contactId")
    .sort({ scheduledAt: 1 });

  res.json(bookings);
};

/* ✅ ALIAS FOR ROUTES (IMPORTANT) */
export const updateBookingStatus = markNoShow;
