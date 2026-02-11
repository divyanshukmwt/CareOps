import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      default: 60,
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "COMPLETED", "NO_SHOW"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
