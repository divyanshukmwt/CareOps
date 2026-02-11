"use client";

import { useState } from "react";

export default function CreateWorkspacePage() {
  const [form, setForm] = useState({
    name: "",
    timezone: "",
    contactEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Workspace created successfully ✅");
      setForm({ name: "", timezone: "", contactEmail: "" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Create Workspace</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Business Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="timezone"
          placeholder="Timezone (Asia/Kolkata)"
          value={form.timezone}
          onChange={handleChange}
          required
        />

        <input
          name="contactEmail"
          type="email"
          placeholder="Contact Email"
          value={form.contactEmail}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}
