"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const res = await fetch("http://localhost:4000/api/bookings", {
      credentials: "include",
    });
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    await fetch(
      `http://localhost:4000/api/bookings/${bookingId}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    loadBookings();
  };

  return (
    <div>
      <h1>Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.contactId?.name}</td>
                <td>{b.serviceName}</td>
                <td>
                  {new Date(b.scheduledAt).toLocaleString()}
                </td>
                <td>{b.status}</td>
                <td>
                  <button
                    onClick={() =>
                      updateStatus(b._id, "COMPLETED")
                    }
                  >
                    Complete
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(b._id, "NO_SHOW")
                    }
                  >
                    No-show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>  
        </table>
      )}
    </div>
  );
}
