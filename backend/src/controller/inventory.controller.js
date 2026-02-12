import Inventory from "../models/inventory.models.js";

export const createInventoryItem = async (req, res) => {
  try {
    const { workspaceId, name, quantityAvailable, lowStockThreshold } =
      req.body;

    const item = await Inventory.create({
      workspaceId,
      name,
      quantityAvailable,
      lowStockThreshold,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create inventory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInventory = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const items = await Inventory.find({ workspaceId });

    res.json(items);
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
