"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicFormPage() {
  const { publicId } = useParams();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/api/public/form/${publicId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.form) {
          setForm(data.form);
        } else {
          setError("Form not found");
        }
      })
      .catch(() => setError("Server error"));
  }, [publicId]);

  const handleChange = (label, value) => {
    setResponses((prev) => ({ ...prev, [label]: value }));
  };

  const submitForm = async () => {
    const res = await fetch(
      `http://localhost:4000/api/public/form/${publicId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      }
    );

    if (!res.ok) {
      setError("Submission failed");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: 40 }}>
        <h2>✅ Form submitted</h2>
        <p>Thank you for completing the form.</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;
  if (!form) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>{form.title}</h2>
      <p>{form.description}</p>

      {form.fields.map((field, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <label>{field.label}</label>

          {field.type === "textarea" ? (
            <textarea
              onChange={(e) =>
                handleChange(field.label, e.target.value)
              }
            />
          ) : (
            <input
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
