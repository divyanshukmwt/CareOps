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

    /* 🔒 FIXED SLOT SYSTEM */
    durationMinutes: {
      type: Number,
      default: 30,
      immutable: true,
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "COMPLETED", "NO_SHOW", "PENDING"],
      default: "CONFIRMED",
    },

    /* 🧑‍💼 SOURCE OF BOOKING */
    source: {
      type: String,
      enum: ["PUBLIC", "ADMIN"],
      default: "PUBLIC",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
