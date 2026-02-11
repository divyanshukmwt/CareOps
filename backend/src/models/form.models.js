import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  label: String,
  type: {
    type: String,
    enum: ["text", "textarea", "checkbox", "number", "date"],
  },
  required: Boolean,
});

const formSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    title: String,
    description: String,
    fields: [fieldSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Form", formSchema);
