"use client";

import React from "react";

export default function Header({ user }) {
  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Workspace</div>
            <div className="text-sm font-semibold text-neutral-900">{user?.workspaceName || "Personal"}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Notifications"
          >
            🔔
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
              {(user?.name || "U").charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-neutral-900">{user?.name || "User"}</div>
              <div className="text-xs text-neutral-500">{user?.email || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
