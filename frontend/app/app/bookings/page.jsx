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

  /* ✅ CREATE BOOKING (ADMIN) */
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

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Bookings</h1>
        <button onClick={() => setShowCreate(true)}>➕ Create Booking</button>
      </div>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="ALL">All</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="NO_SHOW">No-show</option>
      </select>

      {/* CREATE BOOKING FORM */}
      {showCreate && (
        <div style={{ border: "1px solid #444", padding: 16, marginTop: 20 }}>
          <h3>Create Booking (Admin)</h3>

          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <br />

          <input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <br />

          <input
            placeholder="Service"
            value={formData.serviceName}
            onChange={(e) =>
              setFormData({ ...formData, serviceName: e.target.value })
            }
          />
          <br />

          <input
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) =>
              setFormData({ ...formData, scheduledAt: e.target.value })
            }
          />
          <br />

          <select
            value={formData.formId}
            onChange={(e) =>
              setFormData({ ...formData, formId: e.target.value })
            }
          >
            <option value="">Select Form</option>
            {formsList.map((f) => (
              <option key={f._id} value={f._id}>
                {f.title}
              </option>
            ))}
          </select>

          <br /><br />

          <button onClick={createBooking}>Create</button>
          <button onClick={() => setShowCreate(false)}>Cancel</button>
        </div>
      )}

      {/* BOOKINGS TABLE */}
      <table width="100%" cellPadding="10">
        <tbody>
          {filtered.map((b) => (
            <tr key={b._id}>
              <td>{b.contactId?.name}</td>
              <td>{b.serviceName}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => viewForms(b)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BOOKING DETAILS */}
      {selectedBooking && (
        <div style={{ marginTop: 30 }}>
          <h3>Status: {selectedBooking.status}</h3>

          <h3>Form Responses</h3>
          {forms.length === 0 && <p>No form submitted yet.</p>}

          {forms.map((f, i) => (
            <div key={i} style={{ border: "1px solid #555", padding: 10 }}>
              <strong>{f.formTitle}</strong>
              <p>Status: {f.status}</p>

              {Object.entries(f.responses || {}).map(([k, v]) => (
                <div key={k}>
                  <strong>{k}:</strong> {String(v)}
                </div>
              ))}
            </div>
          ))}

          <h4>Inventory Used</h4>
          {inventory.map((i) => (
            <div key={i._id}>
              {i.name} ({i.quantityAvailable})
              <input
                type="number"
                min="0"
                disabled={isFinalized}
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
          ))}

          {!isFinalized && (
            <>
              <button onClick={markCompleted}>Mark Completed</button>
              <button onClick={markNoShow}>Mark No-show</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
