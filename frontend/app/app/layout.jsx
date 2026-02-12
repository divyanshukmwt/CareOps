"use client";

export default function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, borderRight: "1px solid #ddd", padding: 20 }}>
        <h3>CareOps</h3>

        <nav style={{ marginTop: 20 }}>
          <a href="/app/dashboard">Dashboard</a><br />
          <a href="/app/inbox">Inbox</a><br />
          <a href="/app/bookings">Bookings</a><br />
          <a href="/app/forms">Forms</a><br />
          <a href="/app/inventory">Inventory</a><br />
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}
