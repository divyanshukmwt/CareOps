import express from "express";
import {
  createBooking,
  getBookingForms,
  completeBooking,
} from "../controller/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

/* PUBLIC BOOKING */
router.post("/book", createBooking);

/* ADMIN BOOKING (AUTH REQUIRED) */
router.post("/admin/book", requireAuth, createBooking);

/* ADMIN */
router.get("/:bookingId/forms", requireAuth, getBookingForms);
router.patch("/:bookingId/complete", requireAuth, completeBooking);

export default router;
