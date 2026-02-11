import express from "express";
import { completeBooking } from "../controller/bookingStatus.controller.js";

const router = express.Router();

router.post("/:bookingId/complete", completeBooking);

export default router;
