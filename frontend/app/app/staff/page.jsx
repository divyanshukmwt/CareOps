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

  useEffect(() => {
    fetchStaff();
  }, []);

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

  const togglePermission = async (staffId, permission, value) => {
    try {
      setMessage("");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/permission`, {
        method: "PATCH",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ staffId, permission, value }),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || "Failed to toggle permission");
      fetchStaff();
    } catch (err) {
      setMessage(err.message || "Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="page-heading">Staff</h1>
      <p className="meta mt-1">Manage team members and permissions</p>

      <div className="card mt-6">
        <h3 className="section-title mb-1">Add staff member</h3>
        <p className="text-sm text-neutral-500 mb-4">
          They’ll receive an email with their <strong>Workspace ID</strong> and instructions to log in. First-time users will set a password; existing users sign in with their password.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="staff-email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
            <input
              id="staff-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="staff-post" className="block text-sm font-medium text-neutral-700 mb-1.5">Role / designation (optional)</label>
            <input
              id="staff-post"
              type="text"
              placeholder="e.g. Care coordinator"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <button type="button" className="btn-primary" onClick={addStaff}>Send invite</button>
            {message && <p className="text-sm text-neutral-600">{message}</p>}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="section-title mb-4">Staff List</h3>
        <div className="card overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Email</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Post</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Permissions</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-neutral-900">{s.email}</td>
                  <td className="py-3 px-4 text-neutral-700">{s.post || "—"}</td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(s.permissions || {}).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            togglePermission(s._id, key, !value)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            value
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          }`}
                        >
                          {key}: {value ? "ON" : "OFF"}
                        </button>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={s.status === "ACTIVE" ? "pill-success" : "pill-default"}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
