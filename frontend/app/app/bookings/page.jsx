"use client";
import { useEffect, useMemo, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formsList, setFormsList] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceName: "",
    scheduledAt: "",
    formId: "",
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [forms, setForms] = useState([]);
  const [inventoryUsage, setInventoryUsage] = useState([]);

  const isFinalized =
    selectedBooking &&
    (selectedBooking.status === "COMPLETED" ||
      selectedBooking.status === "NO_SHOW");

  /* LOADERS */
  const loadBookings = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setBookings(data);
  };

  const loadInventory = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setInventory(data);
  };

  const loadForms = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setFormsList(data);
  };

  useEffect(() => {
    loadBookings();
    loadInventory();
    loadForms();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  /* ================= ACTIONS (preserve original logic) ================= */
  const createBooking = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/admin/book`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "ADMIN",
        }),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const _data = await res.json();
      if (!res.ok) throw new Error(_data?.message || "API error");

      setShowCreate(false);
      setFormData({
        name: "",
        email: "",
        serviceName: "",
        scheduledAt: "",
        formId: "",
      });

      await loadBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const viewForms = async (b) => {
    setSelectedBooking(b);
    setInventoryUsage([]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${b._id}/forms`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setForms(data);
  };

  const markCompleted = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBooking._id}/complete`, {
      method: "PATCH",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryUsage }),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const _d = await res.json();
    if (!res.ok) throw new Error(_d?.message || "API error");

    setSelectedBooking(null);
    await loadBookings();
    await loadInventory();
  };

  const markNoShow = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBooking._id}/status`, {
      method: "PATCH",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "NO_SHOW" }),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const _r = await res.json();
    if (!res.ok) throw new Error(_r?.message || "API error");

    setSelectedBooking(null);
    await loadBookings();
  };

  const statusPillClass = (status) => {
    if (status === "PENDING") return "pill-pending";
    if (status === "COMPLETED") return "pill-completed";
    if (status === "NO_SHOW") return "pill-no-show";
    return "pill-default";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-heading">Bookings</h1>
          <p className="meta mt-1">Manage scheduled appointments and related forms</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input text-sm max-w-[140px]"
            aria-label="Filter bookings"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="NO_SHOW">No-show</option>
          </select>

          <button className="btn-primary inline-flex items-center gap-2" onClick={() => setShowCreate(true)}>
            <span>➕</span>
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">Create Booking</h3>
              <p className="text-sm text-neutral-500 mt-1">Add a new appointment (admin)</p>
            </div>
            <button type="button" className="text-sm font-medium text-neutral-500 hover:text-neutral-700" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Customer name</label>
              <input
                placeholder="Full name"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                placeholder="email@example.com"
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Service</label>
              <input
                placeholder="Service or meeting type"
                className="input"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date & time</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Form (optional)</label>
              <select
                value={formData.formId}
                onChange={(e) => setFormData({ ...formData, formId: e.target.value })}
                className="input"
              >
                <option value="">Select form</option>
                {formsList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200 flex gap-3">
            <button type="button" className="btn-primary" onClick={createBooking}>Create booking</button>
            <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="hidden sm:block card overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Customer</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Service</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">When</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                  <td className="py-3 px-4 font-medium text-neutral-900">{b.contactId?.name ?? "—"}</td>
                  <td className="py-3 px-4 text-neutral-700">{b.serviceName ?? "—"}</td>
                  <td className="py-3 px-4 text-neutral-700">{new Date(b.scheduledAt).toLocaleString?.() || "—"}</td>
                  <td className="py-3 px-4">
                    <span className={statusPillClass(b.status)}>{b.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline" onClick={() => viewForms(b)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3">
          {filtered.map((b) => (
            <div key={b._id} className="card-compact">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-neutral-900">{b.contactId?.name ?? "—"}</div>
                  <div className="text-sm text-neutral-600 mt-0.5">{b.serviceName ?? "—"}</div>
                  <div className="text-xs text-neutral-500 mt-1">{new Date(b.scheduledAt).toLocaleString?.() || "—"}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={statusPillClass(b.status)}>{b.status}</span>
                  <button className="text-sm font-medium text-blue-600" onClick={() => viewForms(b)}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBooking && (
        <div className="card mt-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-6 border-b border-neutral-200">
            <div>
              <h3 className="section-title">Booking details</h3>
              <p className="text-sm text-neutral-500 mt-1">ID: {selectedBooking._id}</p>
            </div>
            <span className={statusPillClass(selectedBooking.status)}>{selectedBooking.status}</span>
          </div>

          <div className="mt-6">
            <h4 className="text-base font-semibold text-neutral-800">Form responses</h4>
            <p className="text-sm text-neutral-500 mt-0.5">Responses linked to this booking</p>
            {forms.length === 0 && <p className="text-sm text-neutral-500 mt-3">No form submitted yet.</p>}
            <div className="mt-4 space-y-4">
              {forms.map((f, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5">
                  <div className="font-medium text-neutral-900">{f.formTitle}</div>
                  <p className="text-sm text-neutral-500 mt-1">Status: {f.status}</p>
                  <div className="mt-4 text-sm space-y-2">
                    {Object.entries(f.responses || {}).map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <span className="font-medium text-neutral-700 w-40 shrink-0">{k}:</span>
                        <span className="text-neutral-900">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h4 className="text-base font-semibold text-neutral-800">Inventory used</h4>
            <p className="text-sm text-neutral-500 mt-0.5">Enter quantity used when marking complete</p>
            <div className="mt-4 space-y-4">
              {inventory.map((i) => (
                <div key={i._id} className="flex items-center gap-4 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900">{i.name}</div>
                    <div className="text-sm text-neutral-500">Available: {i.quantityAvailable}</div>
                  </div>
                  <div className="w-28">
                    <label className="sr-only">Quantity used for {i.name}</label>
                    <input
                      type="number"
                      min="0"
                      disabled={isFinalized}
                      className="input w-full"
                      placeholder="0"
                      onChange={(e) =>
                        setInventoryUsage((prev) => [
                          ...prev.filter((p) => p.inventoryId !== i._id),
                          {
                            inventoryId: i._id,
                            quantityUsed: Number(e.target.value),
                          },
                        ])
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isFinalized && (
            <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap gap-3">
              <button type="button" className="btn-primary" onClick={markCompleted}>Mark completed</button>
              <button type="button" className="btn-secondary" onClick={markNoShow}>Mark no-show</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
