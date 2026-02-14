import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate inventory items per workspace
inventorySchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export default mongoose.model("Inventory", inventorySchema);
