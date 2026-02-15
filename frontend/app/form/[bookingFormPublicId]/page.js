"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PublicFormCard from "../../../components/ui/PublicFormCard";

export default function PublicFormPage() {
  const { bookingFormPublicId } = useParams();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FORM ================= */
  useEffect(() => {
    if (!bookingFormPublicId) return;

    setLoading(true);
    setError("");

    const parseResponse = async (res) => {
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        json = null;
      }
      if (!res.ok) {
        const body = (json && json.message) || text || res.statusText;
        throw new Error(`API ${res.status}: ${body}`);
      }
      return json ?? text;
    };

    (async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/public/form/${bookingFormPublicId}`;
        let res = await fetch(url, { cache: "no-store" });

        if (res.status === 304) {
          const bustUrl = `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`;
          res = await fetch(bustUrl, { cache: "no-store" });
        }

        const data = await parseResponse(res);
        if (data && data.form) {
          setForm(data.form);
        } else {
          setError("Form not found");
        }
      } catch (err) {
        console.error("Public form load error:", err);
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingFormPublicId]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (label, value) => {
    setResponses((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  /* ================= SUBMIT FORM ================= */
  const submitForm = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/form/${bookingFormPublicId}`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      });
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        json = null;
      }
      if (res.status === 304) throw new Error("Cached response, retry");
      if (!res.ok) {
        const body = (json && json.message) || text || res.statusText;
        throw new Error(`API ${res.status}: ${body}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Form submit error:", err);
      setError(err.message || "Submission failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg shadow-neutral-200/30 p-10 text-center max-w-sm w-full">
          <div className="w-12 h-12 border-2 border-neutral-200 border-t-blue-600 rounded-full animate-spin mx-auto" aria-hidden />
          <p className="mt-5 text-neutral-700 font-medium">Loading form…</p>
          <p className="mt-1 text-sm text-neutral-500">Just a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg shadow-neutral-200/30 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-neutral-900">Something went wrong</h2>
          <p className="mt-2 text-neutral-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/40 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-neutral-900">Form submitted</h2>
          <p className="mt-2 text-neutral-600">Thank you for completing the form.</p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <>
      <PublicFormCard
        form={form}
        responses={responses}
        onChange={handleChange}
        onSubmit={submitForm}
      />
    </>
  );
}
