import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: String,
      enum: ["SYSTEM", "STAFF", "CUSTOMER"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ["INTERNAL", "EMAIL", "SMS"],
      default: "INTERNAL",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
