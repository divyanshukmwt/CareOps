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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/contact`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, workspaceId }),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const _d = await res.json();
    if (!res.ok) throw new Error(_d?.message || "API error");

    alert("Message sent");
    setForm({ name: "", email: "", phone: "", message: "" });
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
