import Booking from "../models/booking.models.js";
import Inventory from "../models/inventory.models.js";
import BookingInventory from "../models/bookingInventory.models.js";
import { checkLowStock } from "../utils/inventoryAlert.util.js";

export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { inventoryUsage } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "COMPLETED";
    await booking.save();

    for (const item of inventoryUsage) {
      const { inventoryId, quantityUsed } = item;

      await BookingInventory.create({
        bookingId: booking._id,
        inventoryId,
        quantityUsed,
      });

      const inventoryItem = await Inventory.findById(inventoryId);

      inventoryItem.quantityAvailable -= quantityUsed;
      await inventoryItem.save();

      await checkLowStock(inventoryItem, booking.workspaceId);
    }

    res.json({ message: "Booking completed and inventory updated" });
  } catch (error) {
    console.error("Complete booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};