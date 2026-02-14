import Inventory from "../models/inventory.models.js";

/* ADD OR UPDATE (RESTOCK) INVENTORY */
export const upsertInventoryItem = async (req, res) => {
  try {
    const { name, quantity, lowStockThreshold } = req.body;
    const workspaceId = req.user.workspaceId;

    if (!name || quantity === undefined) {
      return res.status(400).json({ message: "Name & quantity required" });
    }

    let item = await Inventory.findOne({ workspaceId, name });

    // 🔁 UPDATE / RESTOCK
    if (item) {
      item.quantityAvailable += Number(quantity);

      if (lowStockThreshold !== undefined) {
        item.lowStockThreshold = lowStockThreshold;
      }

      await item.save();
      return res.json({ message: "Inventory updated", item });
    }

    // ➕ CREATE NEW ITEM
    item = await Inventory.create({
      workspaceId,
      name,
      quantityAvailable: quantity,
      lowStockThreshold,
    });

    res.status(201).json({ message: "Inventory added", item });
  } catch (err) {
    console.error("Inventory upsert error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET INVENTORY LIST */
export const getInventory = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;

    const items = await Inventory.find({ workspaceId }).lean();

    const result = items.map((i) => ({
      ...i,
      status:
        i.quantityAvailable <= i.lowStockThreshold ? "LOW" : "OK",
    }));

    res.json(result);
  } catch (err) {
    console.error("Get inventory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
