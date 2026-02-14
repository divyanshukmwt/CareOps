import express from "express";
import {
  getInventory,
  upsertInventoryItem,
} from "../controller/inventory.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getInventory);
router.post("/upsert", requireAuth, upsertInventoryItem);

export default router;
