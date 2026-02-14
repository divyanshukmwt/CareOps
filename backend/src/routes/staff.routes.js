import express from "express";
import {
  addStaff,
  listStaff,
  updateStaffPermission,
} from "../controller/staff.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", requireAuth, addStaff);
router.get("/list", requireAuth, listStaff);
router.patch("/permission", requireAuth, updateStaffPermission);

export default router;
