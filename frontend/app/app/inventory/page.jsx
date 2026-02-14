"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");
  const [message, setMessage] = useState("");

  const fetchInventory = async () => {
    const res = await apiFetch("/api/inventory", {
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const addOrUpdate = async () => {
    if (!name || !quantity) return;

    const res = await apiFetch(
      "/api/inventory/upsert",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          quantity: Number(quantity),
          lowStockThreshold:
            threshold !== "" ? Number(threshold) : undefined,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Failed");
      return;
    }

    setMessage(data.message);
    setName("");
    setQuantity("");
    setThreshold("");
    fetchInventory();
  };

  return (
    <div>
      <h2>Inventory</h2>

      <h3>Add / Restock Item</h3>

      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />

      <input
        placeholder="Quantity to add"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />

      <input
        placeholder="Low stock threshold (optional)"
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />

      <button onClick={addOrUpdate}>Save Inventory</button>

      {message && <p>{message}</p>}

      <hr style={{ margin: "30px 0" }} />

      <h3>Inventory List</h3>

      {items.length === 0 ? (
        <p>No inventory items</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Available</th>
              <th>Threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.quantityAvailable}</td>
                <td>{i.lowStockThreshold}</td>
                <td
                  style={{
                    color: i.status === "LOW" ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {i.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
