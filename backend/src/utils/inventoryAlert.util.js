import Message from "../models/message.models.js";

export const checkLowStock = async (inventoryItem, workspaceId) => {
  if (inventoryItem.quantityAvailable <= inventoryItem.lowStockThreshold) {
    await Message.create({
      sender: "SYSTEM",
      content: `Low stock alert: ${inventoryItem.name} is running low`,
      channel: "INTERNAL",
    });
  }
};