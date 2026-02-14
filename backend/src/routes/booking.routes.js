  import express from "express";
  import { requireAuth } from "../middleware/auth.middleware.js";

  import {
    createBooking,
    getBookingForms,
  } from "../controller/booking.controller.js";

  import {
    completeBooking,
    getBookings,
    updateBookingStatus,
  } from "../controller/bookingStatus.controller.js";

  const router = express.Router();

  // Admin booking
  router.post("/admin/book", requireAuth, createBooking);

  // Public booking
  router.post("/book", createBooking);

  // Get bookings
  router.get("/", requireAuth, getBookings);

  // Get booking forms
  router.get("/:bookingId/forms", requireAuth, getBookingForms);

  // Complete booking
  router.patch("/:bookingId/complete", requireAuth, completeBooking);

  // No-show
  router.patch("/:bookingId/status", requireAuth, updateBookingStatus);

  export default router;
