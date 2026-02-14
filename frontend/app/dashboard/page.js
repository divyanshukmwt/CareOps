"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const WORKSPACE_ID = "698c41f69544ffb5052a58c4";
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        const res = await apiFetch("/api/dashboard/stats", {
            credentials: "include",
        });

        const data = await res.json();
        setStats(data);
        setLoading(false);
    };

    useEffect(() => {
        // Initial load
        fetchStats();

        // Join workspace room
        socket.emit("joinWorkspace", WORKSPACE_ID);

        // Listen for dashboard updates
        socket.on("dashboard:update", () => {
            fetchStats();
        });

        return () => {
            socket.off("dashboard:update");
        };
    }, []);

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dashboard</h2>

            <section>
                <h3>Leads & Conversations</h3>
                <p>Total conversations: {stats.totalConversations}</p>
                <p>Unanswered conversations: {stats.unansweredConversations}</p>
                <p>New inquiries today: {stats.newInquiriesToday}</p>
            </section>

            <section style={{ marginTop: "20px" }}>
                <h3>Alerts</h3>
                {stats.alerts.length === 0 ? (
                    <p>No alerts</p>
                ) : (
                    stats.alerts.map((alert, i) => <p key={i}>⚠️ {alert}</p>)
                )}
            </section>

            <section style={{ marginTop: "20px" }}>
                <h3>Bookings</h3>
                <p>Total bookings: {stats.totalBookings}</p>
                <p>Today’s bookings: {stats.todaysBookings}</p>
                <p>Upcoming bookings: {stats.upcomingBookings}</p>
                <p>Completed: {stats.completedBookings}</p>
                <p>No-shows: {stats.noShowBookings}</p>
            </section>
        </div>
    );
}
