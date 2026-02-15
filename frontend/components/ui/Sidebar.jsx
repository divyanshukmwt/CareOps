"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ user }) {
  const pathname = usePathname() || "";

  const items = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/inbox", label: "Inbox" },
    { href: "/app/bookings", label: "Bookings" },
    { href: "/app/forms", label: "Forms" },
    { href: "/app/inventory", label: "Inventory" },
  ];

  const linkClass = (href) => {
    const active = pathname.startsWith(href);
    return `flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    }`;
  };

  return (
    <aside className="w-56 bg-white border-r border-neutral-200 min-h-screen sticky top-0 flex flex-col">
      <div className="p-4 flex-1">
        <div className="mb-6">
          <div className="text-xl font-bold text-neutral-900">CareOps</div>
          <div className="text-xs text-neutral-500 mt-0.5">Operations platform</div>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={linkClass(it.href)}
              aria-current={pathname.startsWith(it.href) ? "page" : undefined}
            >
              {it.label}
            </Link>
          ))}
          {user?.role === "OWNER" && (
            <Link
              href="/app/staff"
              className={linkClass("/app/staff")}
            >
              Staff
            </Link>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-200 text-xs text-neutral-500">
        <div>
          Workspace: <span className="font-medium text-neutral-700">{user?.workspaceName || "—"}</span>
        </div>
      </div>
    </aside>
  );
}
