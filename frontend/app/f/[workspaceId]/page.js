"use client";
import { useState } from "react";

export default function ContactPage({ params }) {
  const { workspaceId } = params;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submit = async () => {
    const res = await fetch("http://localhost:4000/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, workspaceId }),
    });

    if (res.ok) {
      alert("Message sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Contact Us</h2>

      <input placeholder="Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} /><br />

      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} /><br />

      <input placeholder="Phone" value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })} /><br />

      <textarea placeholder="Message" value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })} /><br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
