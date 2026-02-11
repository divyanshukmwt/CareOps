import mongoose from "mongoose";
import { nanoid } from "nanoid";

const bookingFormSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    // ✅ PUBLIC ID (used in /form link)
    publicId: {
      type: String,
      unique: true,
      default: () => nanoid(12),
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    responseData: {
      type: Object,
    },
    submittedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("BookingForm", bookingFormSchema);
