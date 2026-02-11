import { createEvent } from "ics";

export const generateICS = ({
  bookingId,
  title,
  description,
  startDate,
  durationMinutes,
}) => {
  return new Promise((resolve, reject) => {
    const start = [
      startDate.getUTCFullYear(),
      startDate.getUTCMonth() + 1,
      startDate.getUTCDate(),
      startDate.getUTCHours(),
      startDate.getUTCMinutes(),
    ];

    createEvent(
      {
        uid: bookingId,
        title,
        description,
        start,
        duration: { minutes: durationMinutes },
      },
      (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      }
    );
  });
};
