"use client";
import { useEffect, useState } from "react";
import MetricCard from "../../../components/ui/MetricCard";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
      credentials: "include",
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
        setStats(data);
        if (data?.workspaceId) setWorkspaceId(data.workspaceId);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (workspaceId || !stats) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: "include", cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((user) => {
        if (user?.workspaceId) setWorkspaceId(user.workspaceId);
      })
      .catch(() => {});
  }, [stats, workspaceId]);

  const bookingLink = typeof window !== "undefined" && workspaceId
    ? `${window.location.origin}/b/${workspaceId}`
    : null;

  const copyBookingLink = () => {
    if (!bookingLink) return;
    navigator.clipboard.writeText(bookingLink).then(() => {
      const btn = document.getElementById("copy-booking-link-btn");
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = prev; }, 2000);
      }
    });
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <p className="text-neutral-500 font-medium">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page title */}
      <div>
        <h1 className="page-heading">Dashboard</h1>
        <p className="meta mt-1">What’s happening in your business right now</p>
      </div>

      {/* Workspace booking link */}
      {workspaceId && (
        <section className="card border-blue-100 bg-blue-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="section-title">Your booking link</h2>
                <p className="text-sm text-neutral-600 mt-0.5">Share this link with customers so they can book appointments.</p>
                <p className="mt-2 font-mono text-sm text-neutral-800 bg-white/80 rounded-lg px-3 py-2 border border-neutral-200 break-all">
                  {bookingLink}
                </p>
              </div>
            </div>
            <button
              id="copy-booking-link-btn"
              type="button"
              onClick={copyBookingLink}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 4V6a2 2 0 01-2 2h-2m-4-1h8M8 5H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2h2m0 4v2a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2h-2" />
              </svg>
              Copy link
            </button>
          </div>
        </section>
      )}

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Bookings" value={stats.totalBookings} />
        <MetricCard title="Today's Bookings" value={stats.todaysBookings} />
        <MetricCard title="Inbox Messages" value={stats.totalConversations} />
        <MetricCard title="Inventory Alerts" value={stats.inventoryAlerts ?? "—"} />
      </section>

      {/* Alerts */}
      <section className="card">
        <h2 className="section-title mb-4">Alerts</h2>
        {!stats.alerts || stats.alerts.length === 0 ? (
          <p className="text-neutral-500 text-sm">No alerts right now.</p>
        ) : (
          <ul className="space-y-3">
            {stats.alerts.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
              >
                <span className="text-amber-600" aria-hidden>⚠</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent activity */}
      <section className="card">
        <h2 className="section-title mb-4">Recent Activity</h2>
        {!stats.recentActivity || stats.recentActivity.length === 0 ? (
          <p className="text-neutral-500 text-sm">No recent activity.</p>
        ) : (
          <ul className="space-y-2">
            {stats.recentActivity.map((activity, index) => (
              <li
                key={index}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800"
              >
                {activity}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
