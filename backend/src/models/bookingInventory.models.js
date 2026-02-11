import mongoose from "mongoose";

const bookingInventorySchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    quantityUsed: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BookingInventory", bookingInventorySchema);
