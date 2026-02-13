"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [forms, setForms] = useState([]);

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

  const viewForms = async (booking) => {
    setSelectedBooking(booking);

    const res = await fetch(
      `http://localhost:4000/api/bookings/${booking._id}/forms`,
      { credentials: "include" }
    );
    const data = await res.json();
    setForms(data);
  };

  return (
    <div>
      <h1>Bookings</h1>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Forms</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.contactId?.name}</td>
              <td>{b.serviceName}</td>
              <td>{new Date(b.scheduledAt).toLocaleString()}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => viewForms(b)}>View Forms</button>
              </td>
              <td>
                <button onClick={() => updateStatus(b._id, "COMPLETED")}>
                  Complete
                </button>
                <button onClick={() => updateStatus(b._id, "NO_SHOW")}>
                  No-show
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORMS SECTION */}
      {selectedBooking && (
        <div style={{ marginTop: 30 }}>
          <h2>Forms for Booking</h2>

          {forms.length === 0 ? (
            <p>No forms linked</p>
          ) : (
            forms.map((f, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <strong>{f.formTitle}</strong>
                <p>Status: {f.status}</p>

                {f.status === "COMPLETED" && (
                  <ul>
                    {Object.entries(f.responses).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
