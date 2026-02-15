"use client";

import React from "react";
import Link from "next/link";

export default function Hero({ title, subtitle }) {
  return (
    <section className="relative w-full bg-white">
      {/* Top nav — minimal SaaS-style */}
      <nav className="border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-neutral-900 tracking-tight">
            CareOps
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Log in
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
          <div className="lg:w-[52%] text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-[1.15] tracking-tight">
              {title || "Operational excellence for care teams"}
            </h1>
            <p className="mt-5 text-lg text-neutral-600 max-w-xl leading-relaxed">
              {subtitle ||
                "Manage bookings, dynamic forms, customer conversations, and inventory — all from one secure platform."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              >
                View Dashboard
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-2 text-sm text-neutral-500">
              <li>Enterprise-ready security</li>
              <li>99.9% uptime SLA</li>
              <li>GDPR & HIPAA ready</li>
            </ul>
          </div>

          {/* Static image / illustration placeholder — no live dashboard */}
          <div className="lg:w-[48%] w-full flex justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100 overflow-hidden shadow-xl aspect-[4/3] flex items-center justify-center">
              <div className="text-center px-8 py-12">
                <div className="w-16 h-16 mx-auto rounded-xl bg-neutral-200/80 flex items-center justify-center text-neutral-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-neutral-600 font-medium">Dashboard preview</p>
                <p className="text-sm text-neutral-500 mt-1">One place for bookings, inbox, and alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
