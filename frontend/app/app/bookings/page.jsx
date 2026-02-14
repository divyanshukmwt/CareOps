"use client";
import { apiFetch } from "@/lib/api";
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

  const loadBookings = async () => {
    const res = await apiFetch("/api/bookings", {
      credentials: "include",
    });
    setBookings(await res.json());
  };

  const loadInventory = async () => {
    const res = await apiFetch("/api/inventory", {
      credentials: "include",
    });
    setInventory(await res.json());
  };

  const loadForms = async () => {
    const res = await fetch("/api/forms", {
      credentials: "include",
    });
    setFormsList(await res.json());
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

const createBooking = async () => {
  const res = await apiFetch("/api/bookings/admin/book", {  
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, source: "ADMIN" }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setShowCreate(false);
    setFormData({
      name: "",
      email: "",
      serviceName: "",
      scheduledAt: "",
      formId: "",
    });
    loadBookings();
  };

  const viewForms = async (b) => {
    setSelectedBooking(b);
    const res = await apiFetch(
      `/api/bookings/${b._id}/forms`,
      { credentials: "include" }
    );
    setForms(await res.json());
  };

  const markCompleted = async () => {
    await apiFetch(
      `/api/bookings/${selectedBooking._id}/complete`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryUsage }),
      }
    );
    setSelectedBooking(null);
    setInventoryUsage([]);
    loadBookings();
    loadInventory();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Bookings</h1>
        <button onClick={() => setShowCreate(true)}>➕ Create Booking</button>
      </div>

      <small>Mon–Fri | 10:00 AM – 6:00 PM</small>

      <br /><br />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="ALL">All</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="NO_SHOW">No-show</option>
      </select>

      {showCreate && (
        <div style={{ border: "1px solid #333", padding: 16, marginTop: 20 }}>
          <h3>Create Booking (Admin)</h3>

          <input placeholder="Name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <br />

          <input placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <br />

          <input placeholder="Service" value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })} />
          <br />

          <input type="datetime-local" value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} />
          <br />

          <select value={formData.formId}
            onChange={(e) => setFormData({ ...formData, formId: e.target.value })}>
            <option value="">Select Form</option>
            {formsList.map((f) => (
              <option key={f._id} value={f._id}>{f.title}</option>
            ))}
          </select>

          <br /><br />

          <button onClick={createBooking}>Create</button>
          <button onClick={() => setShowCreate(false)}>Cancel</button>
        </div>
      )}

      <table width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Source</th>
            <th>Forms</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((b) => (
            <tr key={b._id}>
              <td>{b.contactId?.name}</td>
              <td>{b.serviceName}</td>
              <td>{new Date(b.scheduledAt).toLocaleString()}</td>
              <td>{b.status}</td>
              <td>{b.source}</td>
              <td>
                <button onClick={() => viewForms(b)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBooking && (
        <div style={{ marginTop: 30 }}>
          <h3>Forms</h3>

          {forms.map((f, i) => (
            <div key={i}>
              <strong>{f.title}</strong>
              {Object.entries(f.responses || {}).map(([k, v]) => (
                <div key={k}>{k}: {String(v)}</div>
              ))}
            </div>
          ))}

          <h4>Inventory Used</h4>
          {inventory.map((i) => (
            <div key={i._id}>
              {i.name} ({i.quantityAvailable})
              <input type="number" min="0"
                onChange={(e) =>
                  setInventoryUsage((prev) => [
                    ...prev.filter(p => p.inventoryId !== i._id),
                    { inventoryId: i._id, quantityUsed: Number(e.target.value) },
                  ])
                }
              />
            </div>
          ))}

          <br />
          <button onClick={markCompleted}>Mark Completed</button>
        </div>
      )}
    </div>
  );
}
