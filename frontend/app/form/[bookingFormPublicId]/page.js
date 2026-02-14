"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
          // Server indicates not modified; re-request forcing a fresh response
          // with a cache-busting query param to avoid the browser sending
          // `If-None-Match` again and getting another 304.
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

  /* ================= UI STATES ================= */
  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ padding: 40 }}>
        <h2>✅ Form submitted</h2>
        <p>Thank you for completing the form.</p>
      </div>
    );
  }

  if (!form) return null;

  /* ================= RENDER FORM ================= */
  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>{form.title}</h2>
      <p>{form.description}</p>

      {form.fields.map((field, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              style={{ width: "100%" }}
              onChange={(e) =>
                handleChange(field.label, e.target.value)
              }
            />
          ) : (
            <input
              style={{ width: "100%" }}
              type={field.type}
              onChange={(e) =>
                handleChange(field.label, e.target.value)
              }
            />
          )}
        </div>
      ))}

      <button onClick={submitForm}>Submit</button>
    </div>
  );
}
