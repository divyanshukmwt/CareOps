import express from "express";
import {
  getBookings,
  updateBookingStatus,
} from "../controller/bookingStatus.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getBookings);
router.patch("/:bookingId/status", requireAuth, updateBookingStatus);

export default router;
