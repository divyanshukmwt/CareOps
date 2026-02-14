import Booking from "../models/booking.models.js";

const SLOT_DURATION_MINUTES = 30;
const START_HOUR = 10; // 10 AM
const END_HOUR = 18;   // 6 PM

/* ===============================
   DATE VALIDATION
================================ */
export const isValidBookingDay = (date) => {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  return day >= 1 && day <= 5; // Mon–Fri
};

/* ===============================
   TIME VALIDATION
================================ */
export const isValidBookingTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (minutes !== 0 && minutes !== 30) return false;
  if (hours < START_HOUR || hours >= END_HOUR) return false;

  return true;
};

/* ===============================
   SLOT CONFLICT CHECK
================================ */
export const isSlotAvailable = async (workspaceId, scheduledAt) => {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);

  const conflict = await Booking.findOne({
    workspaceId,
    scheduledAt: {
      $gte: start,
      $lt: end,
    },
  });

  return !conflict;
};

/* ===============================
   GET AVAILABLE SLOTS FOR A DAY
================================ */
export const getAvailableSlotsForDate = async (workspaceId, date) => {
  const slots = [];

  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    for (let min of [0, 30]) {
      const slot = new Date(baseDate);
      slot.setHours(hour, min, 0, 0);

      if (await isSlotAvailable(workspaceId, slot)) {
        slots.push(slot);
      }
    }
  }

  return slots;
};

/* ===============================
   MAIN VALIDATOR
================================ */
export const validateBookingSlot = async (workspaceId, scheduledAt) => {
  const date = new Date(scheduledAt);

  if (!isValidBookingDay(date)) {
    return {
      valid: false,
      message: "Bookings are allowed only Monday to Friday",
    };
  }

  if (!isValidBookingTime(date)) {
    return {
      valid: false,
      message: "Bookings allowed between 10:00 AM and 6:00 PM (30 min slots)",
    };
  }

  const available = await isSlotAvailable(workspaceId, date);
  if (!available) {
    const slots = await getAvailableSlotsForDate(workspaceId, date);
    return {
      valid: false,
      message: "Selected slot is not available",
      availableSlots: slots,
    };
  }

  return { valid: true };
};
