  "use client";
  import { apiFetch } from "@/lib/api";
  import { useEffect, useState } from "react";

  export default function AppLayout({ children }) {
    const [user, setUser] = useState(null);

useEffect(() => {
  apiFetch("/api/auth/me")
    .then((data) => {
      setUser(data);
    })
    .catch(() => {});
}, []);


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

            {user?.role === "OWNER" && (
              <>
                <a href="/app/staff">Staff</a><br />
              </>
            )}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 20 }}>
          {children}
        </main>
      </div>
    );
  }
