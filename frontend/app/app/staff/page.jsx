"use client";

import { useEffect, useState } from "react";

export default function StaffPage() {
  const [email, setEmail] = useState("");
  const [post, setPost] = useState("");
  const [staff, setStaff] = useState([]);
  const [message, setMessage] = useState("");

  const fetchStaff = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/list`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setStaff(data);
  };

  const addStaff = async () => {
    if (!email) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/add`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, post }),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const _d = await res.json();
      if (!res.ok) throw new Error(_d?.message || "API error");

      setEmail("");
      setPost("");
      setMessage("✅ Staff added successfully");
      fetchStaff();
    } catch (err) {
      setMessage(err.message);
    }
  };


  return (
    <div>
      <h2>Add Staff</h2>

      <input
        placeholder="Staff Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <textarea
        placeholder="Post / Designation"
        value={post}
        onChange={(e) => setPost(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={addStaff}>Add Staff</button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      <hr style={{ margin: "30px 0" }} />

      <h2>Staff List</h2>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Post</th>
            <th>Permissions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{s.post || "-"}</td>

              <td>
                {Object.entries(s.permissions || {}).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() =>
                      togglePermission(s._id, key, !value)
                    }
                    style={{
                      marginRight: 6,
                      marginBottom: 6,
                      padding: "4px 10px",
                      background: value ? "#16a34a" : "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    {key}: {value ? "ON" : "OFF"}
                  </button>
                ))}
              </td>

              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
