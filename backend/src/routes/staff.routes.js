import express from "express";
import { addStaff } from "../controller/staff.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", requireAuth, addStaff);

export default router;
