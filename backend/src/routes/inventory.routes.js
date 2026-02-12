import express from "express";
import { getInventory } from "../controller/inventory.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getInventory);

export default router;
