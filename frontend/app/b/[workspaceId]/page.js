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

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/40 p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-neutral-900">Booking confirmed</h2>
          <p className="mt-2 text-neutral-600 text-sm">
            We’ve sent a confirmation to your email with your booking details and a link to chat with us. Check your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/40 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">Workspace Booking</h1>
              <p className="text-sm text-neutral-500 mt-0.5">Book an appointment — simple and secure</p>
            </div>
          </div>

          <p className="text-sm text-neutral-500 mt-4 mb-6">Mon–Fri · 10:00 AM – 6:00 PM</p>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-2 text-sm text-red-800">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Your details
              </h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="b-name" className="sr-only">Your name</label>
                  <input
                    id="b-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="b-email" className="sr-only">Your email</label>
                  <input
                    id="b-email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Appointment type
              </h3>
              {loadingForms ? (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-500">
                  Loading options…
                </div>
              ) : (
                <select
                  id="b-form"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {forms.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.title}
                    </option>
                  ))}
                </select>
              )}
            </section>

            <section>
              <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Date & time
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="b-date" className="sr-only">Date</label>
                  <input
                    id="b-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="b-time" className="sr-only">Time</label>
                  <input
                    id="b-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={submitBooking}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all hover:shadow-md active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
