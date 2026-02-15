"use client";
import { useEffect, useState } from "react";

export default function FormsPage() {
  const [forms, setForms] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [fields, setFields] = useState([]);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [required, setRequired] = useState(false);

  const loadForms = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setForms(data);
  };

  useEffect(() => {
    loadForms();
  }, []);

  const addField = () => {
    if (!fieldLabel) return;

    setFields([
      ...fields,
      { label: fieldLabel, type: fieldType, required },
    ]);

    setFieldLabel("");
    setRequired(false);
    setFieldType("text");
  };

  const createForm = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, fields }),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const _d = await res.json();
      if (!res.ok) throw new Error(_d?.message || "API error");

      setTitle("");
      setDescription("");
      setFields([]);
      loadForms();
    } catch {
      alert("Failed to create form");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h1 className="page-heading">Forms</h1>
          <p className="meta mt-1">Create and manage form templates</p>

          <div className="mt-6">
            <h3 className="section-title mb-4">Create New Form</h3>

            <div className="space-y-4">
              <input
                placeholder="Form title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />

              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
              />

              <hr className="my-6 border-neutral-200" />

              <h4 className="font-semibold text-neutral-800">Add Field</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  placeholder="Field label"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  className="input md:col-span-2"
                />

                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                  className="input"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-neutral-600">Required</span>
              </label>

              <div>
                <button className="btn-primary" onClick={addField}>Add Field</button>
              </div>

              <div className="mt-4">
                <ul className="space-y-2">
                  {fields.map((f, i) => (
                    <li key={i} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                      <div className="font-medium text-neutral-900">{f.label}</div>
                      <div className="text-sm text-neutral-500 mt-0.5">{f.type} {f.required ? "• required" : ""}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button className="btn-primary" onClick={createForm}>Create Form</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="card">
          <h3 className="section-title mb-4">Existing Forms</h3>
          <div className="space-y-3">
            {forms.length === 0 ? (
              <p className="text-sm text-neutral-500">No forms yet.</p>
            ) : (
              forms.map((f) => (
                <div key={f._id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <div className="font-semibold text-neutral-900">{f.title}</div>
                  <div className="text-sm text-neutral-600 mt-0.5">{f.description || "—"}</div>
                  <div className="text-xs text-neutral-500 mt-2">{f.fields?.length ?? 0} fields</div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
