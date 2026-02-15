"use client";

import React from "react";

export default function DashboardPreview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-primary-600">
          <div className="kpi">
            <div className="kpi-value">24</div>
            <div className="kpi-label">New bookings (Today)</div>
          </div>
          <div className="meta mt-2">Up 12% from yesterday</div>
        </div>

        <div className="card p-5 border-l-4 border-amber-400">
          <div className="kpi">
            <div className="kpi-value">8</div>
            <div className="kpi-label">Open conversations</div>
          </div>
          <div className="meta mt-2">Requires response</div>
        </div>

        <div className="card p-5 border-l-4 border-sky-400">
          <div className="kpi">
            <div className="kpi-value">120</div>
            <div className="kpi-label">Items tracked</div>
          </div>
          <div className="meta mt-2">5 low-stock alerts</div>
        </div>
      </div>

      <div className="card p-4 overflow-auto">
        <div className="section-title">Recent Bookings</div>
        <table className="w-full text-sm mt-3">
          <thead className="text-left text-xs meta border-b border-gray-100">
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Service</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-slate-50">
              <td className="py-3">14 Feb</td>
              <td className="py-3">Jane Doe</td>
              <td className="py-3">Visit</td>
              <td className="py-3"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3">13 Feb</td>
              <td className="py-3">Acme Org</td>
              <td className="py-3">Assessment</td>
              <td className="py-3"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
