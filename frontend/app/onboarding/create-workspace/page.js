"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateWorkspace() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    timezone: "",
    contactEmail: "",
  });
  const [workspaceId, setWorkspaceId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { cache: "no-store" })
      .then((res) => {
        if (res.status === 304) throw new Error("Cached response, retry");
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data?.message || "API error");
          return data;
        });
      })
      .then((u) => setForm((f) => ({ ...f, contactEmail: u.email })))
      .catch(() => {});
  }, []);

  const submit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workspaces`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setWorkspaceId(data.workspaceId);
  };

  return (
    <>
      <input placeholder="Business Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
        <option value="">Timezone</option>
        <option value="Asia/Kolkata">Asia/Kolkata</option>
      </select>
      <input value={form.contactEmail} disabled />

      <button onClick={submit}>Create</button>

      {workspaceId && (
        <>
          <p>Workspace ID:</p>
          <code>{workspaceId}</code>
          <button onClick={() => router.push("/app/dashboard")}>
            Continue
          </button>
        </>
      )}
    </>
  );
}
