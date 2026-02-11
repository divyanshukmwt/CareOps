import express from "express";
import Booking from "../models/booking.models.js";
import Contact from "../models/contact.models.js";
import { generateICS } from "../utils/ics.util.js";

const router = express.Router();

router.get("/booking/:bookingId.ics", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("contactId");

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    const icsContent = await generateICS({
      bookingId: booking._id.toString(),
      title: booking.serviceName,
      description: `Booking for ${booking.contactId.name}`,
      startDate: booking.scheduledAt,
      durationMinutes: booking.durationMinutes,
    });

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking-${booking._id}.ics`
    );

    res.send(icsContent);
  } catch (error) {
    console.error("ICS download error:", error);
    res.status(500).send("Error generating calendar");
  }
});

export default router;
