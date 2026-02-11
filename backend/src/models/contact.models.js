import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
