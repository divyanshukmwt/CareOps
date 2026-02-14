  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { apiFetch } from "@/lib/api";

  export default function CreateWorkspacePage() {
    const router = useRouter();

    const [form, setForm] = useState({
      name: "",
      timezone: "",
      contactEmail: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
      setLoading(true);

      try {
        const res = await apiFetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔐 REQUIRED
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Workspace creation failed");
          setLoading(false);
          return;
        }

        // ✅ JWT IS UPDATED BY BACKEND
        router.push("/app/dashboard");
      } catch (error) {
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ maxWidth: 400, margin: "100px auto" }}>
        <h1>Create Workspace</h1>

        <input
          name="name"
          placeholder="Business Name"
          value={form.name}
          onChange={handleChange}
        />

        <select
          name="timezone"
          value={form.timezone}
          onChange={handleChange}
        >
          <option value="">Select Timezone</option>
          <option value="Asia/Kolkata">Asia/Kolkata (India)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
        </select>

        <input
          name="contactEmail"
          placeholder="Contact Email"
          value={form.contactEmail}
          onChange={handleChange}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </div>
    );
  }
