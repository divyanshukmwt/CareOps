"use client";

import React from "react";

export default function FeatureCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex gap-4 items-start hover:border-neutral-300 transition-colors">
      <div className="flex-none w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
        {icon || (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-neutral-600 mt-2 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
