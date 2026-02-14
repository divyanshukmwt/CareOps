"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("OWNER");
  const [step, setStep] = useState("IDENTIFY");

  const [workspaceId, setWorkspaceId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkStaff = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/staff/check`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, workspaceId }),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "API error");

      setStep(data.hasPassword ? "LOGIN" : "SET_PASSWORD");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          role === "OWNER"
            ? { email, password }
            : { email, password, workspaceId }
        ),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const _d = await res.json();
      if (!res.ok) throw new Error(_d?.message || "API error");

      router.push("/app/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };


  const setStaffPassword = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/staff/set-password`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, workspaceId }),
    });
    if (res.status === 304) return alert("Failed");
    const _d = await res.json();
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
