import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
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
      unique: true,
    },
    isAutoPaused: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
