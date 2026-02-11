import express from "express";
import { getDashboardStats } from "../controller/dashboard.controller.js";

const router = express.Router();

router.get("/:workspaceId", getDashboardStats);

export default router;
