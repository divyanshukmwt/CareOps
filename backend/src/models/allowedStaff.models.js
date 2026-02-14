import mongoose from "mongoose";

const allowedStaffSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    post: {
      type: String,
      default: "",
    },

    permissions: {
      inbox: { type: Boolean, default: true },
      bookings: { type: Boolean, default: true },
      forms: { type: Boolean, default: false },
      inventory: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("AllowedStaff", allowedStaffSchema);
