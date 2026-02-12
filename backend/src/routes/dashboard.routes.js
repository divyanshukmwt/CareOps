import express from "express";
import { getDashboardStats } from "../controller/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", requireAuth, getDashboardStats);

export default router;
