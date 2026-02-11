import express from "express";
import {
  createInventoryItem,
  getInventory,
} from "../controller/inventory.controller.js";

const router = express.Router();

router.post("/", createInventoryItem);
router.get("/:workspaceId", getInventory);

export default router;
