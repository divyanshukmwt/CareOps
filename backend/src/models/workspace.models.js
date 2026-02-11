import mongoose from "mongoose";
import { nanoid } from "nanoid";

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
    isActive: {
      type: Boolean,
      default: false,
    },

    // ✅ PUBLIC ID (used in /f and /b links)
    publicId: {
      type: String,
      unique: true,
      default: () => nanoid(10),
    },
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
