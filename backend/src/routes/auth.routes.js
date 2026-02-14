import express from "express";
import {
  register,
  login,
  logout,
  checkStaffAccess,
  setStaffPassword,
  me, // 👈 add this
} from "../controller/auth.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

/* STAFF FLOW */
router.post("/staff/check", checkStaffAccess);
router.post("/staff/set-password", setStaffPassword);

/* AUTH CHECK */
router.get("/me", requireAuth, me); // 👈 THIS IS MISSING

export default router;
