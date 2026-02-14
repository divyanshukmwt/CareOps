"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("OWNER");
  const [step, setStep] = useState("IDENTIFY");

  const [workspaceId, setWorkspaceId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkStaff = async () => {
    const res = await apiFetch("/api/auth/staff/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, workspaceId }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setStep(data.hasPassword ? "LOGIN" : "SET_PASSWORD");
  };

  const login = async () => {
    const payload =
      role === "OWNER"
        ? { email, password }
        : { email, password, workspaceId };

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) return alert("Login failed");
    router.push("/app/dashboard");
  };


  const setStaffPassword = async () => {
    const res = await apiFetch("/api/auth/staff/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, workspaceId }),
    });

    if (!res.ok) return alert("Failed");
    router.push("/app/dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h1>Login</h1>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="OWNER">Owner</option>
        <option value="STAFF">Staff</option>
      </select>

      <input placeholder="Workspace ID" onChange={(e) => setWorkspaceId(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      {role === "OWNER" && (
        <>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </>
      )}

      {role === "STAFF" && step === "IDENTIFY" && (
        <button onClick={checkStaff}>Continue</button>
      )}

      {role === "STAFF" && step !== "IDENTIFY" && (
        <>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={step === "LOGIN" ? login : setStaffPassword}>
            {step === "LOGIN" ? "Login" : "Set Password"}
          </button>
        </>
      )}
    </div>
  );
}
