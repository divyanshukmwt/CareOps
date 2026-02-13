import express from "express";
import { createWorkspace } from "../controller/workspace.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createWorkspace);

export default router;
