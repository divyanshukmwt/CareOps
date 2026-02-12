"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function PublicBookingPage() {
    const { workspaceId } = useParams();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [serviceName, setServiceName] = useState("Initial Consultation");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const submitBooking = async () => {
        setLoading(true);
        setError("");

        const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

        try {
            const res = await fetch("http://localhost:4000/api/bookings/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    workspaceId,
                    name,
                    email,
                    serviceName,
                    scheduledAt,
                    durationMinutes: 60, // ✅ FIX
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Booking failed");
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: 40 }}>
                <h1>✅ Booking Confirmed</h1>
                <p>Please check your email or messages for next steps.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 500, margin: "50px auto" }}>
            <h1>Book an Appointment</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <input
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            >
                <option>Initial Consultation</option>
                <option>Follow-up Session</option>
            </select>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <button onClick={submitBooking} disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
            </button>
        </div>
    );
}
