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

  const [loading, setLoading] = useState(false);
  const [loadingForms, setLoadingForms] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ================= LOAD FORMS ================= */
useEffect(() => {
  if (!workspaceId) return;

  setLoadingForms(true);
  setError("");

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/forms/${workspaceId}`, {
    cache: "no-store",
  })
    .then((res) => {
      if (res.status === 304) throw new Error("Cached response, retry");
      return res.json().then((data) => {
        if (!res.ok) throw new Error(data?.message || "API error");
        return data;
      });
    })
    .then((data) => {
      setForms(data);
      if (data.length > 0) setFormId(data[0]._id);
    })
    .catch(() => setError("Failed to load forms"))
    .finally(() => setLoadingForms(false));
}, [workspaceId]);

const submitBooking = async () => {
  if (!name || !email || !date || !time || !formId) {
    setError("All fields are required");
    return;
  }

  setLoading(true);
  setError("");

  const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/book`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name,
          email,
          serviceName: "Appointment",
          scheduledAt,
          formId,
        }),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const _d = await res.json();
      if (!res.ok) throw new Error(_d?.message || "API error");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};
  

  /* ================= UI ================= */
  if (success) {
    return (
      <div style={styles.container}>
        <h2>✅ Booking Confirmed</h2>
        <p>You will receive a form link shortly.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Book an Appointment</h2>

      <small>Mon–Fri | 10:00 AM – 6:00 PM</small>

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

/* ================= STYLES ================= */
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
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#1c1c1c",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
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
