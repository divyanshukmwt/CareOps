"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicBookingPage() {
  const { workspaceId } = useParams();

  const [forms, setForms] = useState([]);
  const [formId, setFormId] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loadingForms, setLoadingForms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     LOAD FORMS SAFELY
  ================================ */
  useEffect(() => {
    setLoadingForms(true);
    setError("");

    fetch(`http://localhost:4000/api/public/forms/${workspaceId}`)
      .then(async (res) => {
        const data = await res.json();

        // ✅ FORCE ARRAY SAFETY
        if (Array.isArray(data)) {
          setForms(data);
          if (data.length > 0) setFormId(data[0]._id);
        } else {
          setForms([]);
          setError(data.message || "No forms available");
        }
      })
      .catch(() => {
        setForms([]);
        setError("Failed to load forms");
      })
      .finally(() => setLoadingForms(false));
  }, [workspaceId]);

  /* ===============================
     SUBMIT BOOKING
  ================================ */
  const submitBooking = async () => {
    if (!formId) {
      setError("Please select a form");
      return;
    }

    setLoading(true);
    setError("");

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    try {
      const res = await fetch("http://localhost:4000/api/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name,
          email,
          serviceName: "Booking",
          scheduledAt,
          durationMinutes: 60,
          formId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Booking failed");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI STATES
  ================================ */
  if (success) {
    return (
      <div style={styles.container}>
        <h2>✅ Booking Confirmed</h2>
        <p>You’ll receive a form link shortly.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: 20 }}>Book an Appointment</h2>

      {error && <p style={styles.error}>{error}</p>}

      <input
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {loadingForms ? (
        <p>Loading forms…</p>
      ) : forms.length === 0 ? (
        <p style={styles.error}>No forms available</p>
      ) : (
        <select
          style={styles.input}
          value={formId}
          onChange={(e) => setFormId(e.target.value)}
        >
          {forms.map((f) => (
            <option key={f._id} value={f._id}>
              {f.title}
            </option>
          ))}
        </select>
      )}

      <input
        style={styles.input}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        style={styles.input}
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button
        style={styles.button}
        onClick={submitBooking}
        disabled={loading}
      >
        {loading ? "Booking…" : "Confirm Booking"}
      </button>
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const styles = {
  container: {
    maxWidth: 420,
    margin: "60px auto",
    padding: 20,
    background: "#111",
    borderRadius: 10,
    color: "#fff",
    fontFamily: "sans-serif",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#1c1c1c",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "#ff6b6b",
    marginBottom: 10,
  },
};
