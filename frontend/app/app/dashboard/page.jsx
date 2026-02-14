"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/api/dashboard/stats", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <h3>Bookings</h3>
      <ul>
        <li>Total: {stats.totalBookings}</li>
        <li>Today: {stats.todaysBookings}</li>
        <li>Upcoming: {stats.upcomingBookings}</li>
      </ul>

      <h3>Inbox</h3>
      <ul>
        <li>Total conversations: {stats.totalConversations}</li>
        <li>Unanswered: {stats.unansweredConversations}</li>
      </ul>

      <h3>Alerts</h3>
      {stats.alerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        <ul>
          {stats.alerts.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
