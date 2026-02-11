import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
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
    quantityAvailable: {
      type: Number,
      required: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
