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
    const res = await fetch("http://localhost:4000/api/forms", {
      credentials: "include",
    });
    const data = await res.json();
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
    const res = await fetch("http://localhost:4000/api/forms", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        fields,
      }),
    });

    if (!res.ok) {
      alert("Failed to create form");
      return;
    }

    setTitle("");
    setDescription("");
    setFields([]);
    loadForms();
  };

  return (
    <div>
      <h1>Forms</h1>

      <h3>Create New Form</h3>

      <input
        placeholder="Form title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <hr />

      <h4>Add Field</h4>

      <input
        placeholder="Field label"
        value={fieldLabel}
        onChange={(e) => setFieldLabel(e.target.value)}
      />

      <select
        value={fieldType}
        onChange={(e) => setFieldType(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="checkbox">Checkbox</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        Required
      </label>

      <button onClick={addField}>Add Field</button>

      <ul>
        {fields.map((f, i) => (
          <li key={i}>
            {f.label} ({f.type}) {f.required && "*"}
          </li>
        ))}
      </ul>

      <button onClick={createForm}>Create Form</button>

      <hr />

      <h3>Existing Forms</h3>
      {forms.map((f) => (
        <div key={f._id}>
          <strong>{f.title}</strong>
          <p>{f.description}</p>
          <small>{f.fields.length} fields</small>
        </div>
      ))}
    </div>
  );
}
