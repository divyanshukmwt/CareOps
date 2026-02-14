import express from "express";
import {
  register,
  login,
  logout,
  checkStaffAccess,
  setStaffPassword,
  me,
} from "../controller/auth.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/staff/check", checkStaffAccess);
router.post("/staff/set-password", setStaffPassword);

router.get("/me", requireAuth, me);

export default router;
