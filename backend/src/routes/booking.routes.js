import express from "express";
import {
  createBooking,
  getBookingForms,
} from "../controller/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.post("/book", createBooking);

// ADMIN
router.get("/:bookingId/forms", requireAuth, getBookingForms);

export default router;
