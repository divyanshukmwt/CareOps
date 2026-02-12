"use client";

import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/inventory", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Inventory</h1>

      {items.length === 0 ? (
        <p>No inventory items</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.quantityAvailable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
