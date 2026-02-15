"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateWorkspace() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    timezone: "",
    contactEmail: "",
  });
  const [workspaceId, setWorkspaceId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { cache: "no-store", credentials: "include" })
      .then((res) => {
        if (res.status === 304) throw new Error("Cached response, retry");
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data?.message || "API error");
          return data;
        });
      })
      .then((u) => setForm((f) => ({ ...f, contactEmail: u.email })))
      .catch(() => {});
  }, []);

  const submit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workspaces`, {
      method: "POST",
      cache: "no-store",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setWorkspaceId(data.workspaceId);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg shadow-neutral-200/50 p-8 sm:p-10">
          {!workspaceId ? (
            <>
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Set up your workspace
              </h1>
              <p className="mt-2 text-neutral-600 text-sm">
                Create your first workspace to start managing bookings and operations.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label htmlFor="ws-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Business name
                  </label>
                  <input
                    id="ws-name"
                    type="text"
                    placeholder="Your business or team name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="ws-timezone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Timezone
                  </label>
                  <select
                    id="ws-timezone"
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select timezone</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="America/New_York">America/New York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ws-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Contact email
                  </label>
                  <input
                    id="ws-email"
                    type="email"
                    value={form.contactEmail}
                    disabled
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-neutral-600"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Uses your account email</p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={submit}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create workspace
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-neutral-900 text-center">
                Workspace created
              </h2>
              <p className="mt-2 text-neutral-600 text-sm text-center">
                Save this ID to invite staff or share with your team.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  Workspace ID
                </label>
                <code className="block text-sm font-mono text-neutral-900 break-all">{workspaceId}</code>
              </div>
              <button
                type="button"
                onClick={() => router.push("/app/dashboard")}
                className="mt-8 w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue to dashboard
              </button>
            </>
          )}
        </div>

        {/* Skip to dashboard removed to enforce authentication */}
      </div>
    </div>
  );
}
