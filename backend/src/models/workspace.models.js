import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },

    // ✅ REQUIRED OWNER
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workspace", workspaceSchema);
