import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
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

export default mongoose.model("User", userSchema);
