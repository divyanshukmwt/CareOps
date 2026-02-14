import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, lowercase: true, trim: true },
    password: String,
    hasPassword: Boolean,
    role: { type: String, enum: ["OWNER", "STAFF"] },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, workspaceId: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
