"use client";

import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");
  const [message, setMessage] = useState("");

const fetchInventory = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
    credentials: "include",
    cache: "no-store",
  });
  if (res.status === 304) throw new Error("Cached response, retry");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "API error");
  setItems(data);
};

  useEffect(() => {
    fetchInventory();
  }, []);

const addOrUpdate = async () => {
  if (!name || !quantity) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/upsert`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        quantity: Number(quantity),
        lowStockThreshold:
          threshold !== "" ? Number(threshold) : undefined,
      }),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");

    setMessage(data.message);
    setName("");
    setQuantity("");
    setThreshold("");
    fetchInventory();
  } catch (err) {
    setMessage(err.message);
  }
};

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="page-heading">Inventory</h1>
      <p className="meta mt-1">Track stock and low-stock alerts</p>

      <div className="card mt-6">
        <h3 className="section-title mb-4">Add / Restock Item</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input md:col-span-2"
          />
          <input
            placeholder="Quantity to add"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input"
          />
          <input
            placeholder="Low stock threshold (optional)"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="input md:col-span-2"
          />
          <div className="flex flex-col gap-2">
            <button className="btn-primary" onClick={addOrUpdate}>Save Inventory</button>
            {message && <p className="text-sm text-neutral-600">{message}</p>}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="section-title mb-4">Inventory List</h3>

        {items.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <p className="text-neutral-500 font-medium">No inventory items</p>
            <p className="text-sm text-neutral-500 mt-1">Add an item above to get started.</p>
          </div>
        ) : (
          <div className="card overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Name</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Available</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Threshold</th>
                  <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i._id} className="hover:bg-neutral-50 border-b border-neutral-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-neutral-900">{i.name}</td>
                    <td className="py-3 px-4 text-neutral-700 tabular-nums">{i.quantityAvailable}</td>
                    <td className="py-3 px-4 text-neutral-600">{i.lowStockThreshold ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className={i.status === "LOW" ? "pill-error" : "pill-success"}>{i.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
