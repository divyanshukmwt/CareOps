"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
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
    apiFetch("/api/auth/me").then((u) =>
      setForm((f) => ({ ...f, contactEmail: u.email }))
    );
  }, []);

  const submit = async () => {
    const data = await apiFetch("/api/workspaces", {
      method: "POST",
      body: JSON.stringify(form),
    });
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
