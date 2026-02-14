import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String },

    hasPassword: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["OWNER", "STAFF"],
      default: "OWNER",
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
  },
  { timestamps: true }
);

/* ✅ EMAIL UNIQUE PER WORKSPACE (CORRECT MODEL) */
userSchema.index({ email: 1, workspaceId: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
