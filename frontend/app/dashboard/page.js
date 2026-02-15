"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import DashboardPreview from "../../components/ui/DashboardPreview";

const WORKSPACE_ID = "698c41f69544ffb5052a58c4";
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
            credentials: "include",
            cache: "no-store",
        });
        if (res.status === 304) throw new Error("Cached response, retry");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "API error");
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
        <div className="p-6 max-w-6xl mx-auto">
            <header className="flex items-center justify-between">
                <h2 className="page-heading">Dashboard</h2>
                <div className="text-sm meta">Updated live</div>
            </header>

            {/* Top row: Key metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-5">
                    <div className="kpi">
                        <div className="kpi-value">{stats.totalBookings}</div>
                        <div className="kpi-label">Total Bookings</div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="kpi">
                        <div className="kpi-value">{stats.todaysBookings}</div>
                        <div className="kpi-label">Today's Bookings</div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="kpi">
                        <div className="kpi-value">{stats.unansweredConversations ?? stats.totalConversations ?? 0}</div>
                        <div className="kpi-label">Open Conversations</div>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="kpi">
                        <div className="kpi-value">{stats.inventoryItems ?? stats.inventoryCount ?? '-'}</div>
                        <div className="kpi-label">Inventory Items</div>
                    </div>
                </div>
            </div>

            {/* Middle: Alerts */}
            <div className="mt-6">
                <div className="section-title">Alerts & Notifications</div>
                <div className="mt-3">
                    {stats.alerts.length === 0 ? (
                        <div className="card-alt p-3 meta">You're all caught up — no alerts.</div>
                    ) : (
                        stats.alerts.map((alert, i) => (
                            <div key={i} className="alert mt-2">⚠️ {alert}</div>
                        ))
                    )}
                </div>
            </div>

            {/* Bottom: Recent activity */}
            <div className="mt-6">
                <div className="section-title">Recent activity</div>
                <div className="mt-4">
                    <DashboardPreview />
                </div>
            </div>
        </div>
    );
}
