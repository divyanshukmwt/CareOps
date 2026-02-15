"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { cache: "no-store", credentials: "include" })
      .then((res) => {
        if (res.status === 304) throw new Error("Cached response, retry");
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data?.message || "API error");
          return data;
        });
      })
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
