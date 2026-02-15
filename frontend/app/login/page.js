"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("OWNER");
  const [step, setStep] = useState("IDENTIFY");

  const [workspaceId, setWorkspaceId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkStaff = async () => {
    if (!workspaceId?.trim()) {
      alert("Please enter your Workspace ID");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/staff/check`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, workspaceId: workspaceId.trim() }),
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
    const wid = workspaceId?.trim();
    if (!wid) {
      alert("Please enter your Workspace ID");
      return;
    }
    if (!password?.trim()) {
      alert("Please enter your password");
      return;
    }
    try {
      const payload = {
        email: email.trim(),
        password: password.trim(),
        workspaceId: wid,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 304) throw new Error("Cached response, retry");
      const _d = await res.json();
      if (!res.ok) throw new Error(_d?.message || "API error");
      router.push("/app/dashboard");
    } catch (err) {
      alert(err?.message || "Login failed");
    }
  };

  const setStaffPassword = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/staff/set-password`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, workspaceId: workspaceId.trim() }),
      });
      if (res.status === 304) return alert("Failed");
      const _d = await res.json();
      if (!res.ok) return alert(_d?.message || "Failed");
      router.push("/app/dashboard");
    } catch {
      alert("Failed");
    }
  };

  const canProceed = workspaceId?.trim() && email?.trim();
  const canLoginOwner = canProceed && role === "OWNER" && password?.trim();

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/30 p-8">
          <h1 className="text-2xl font-bold text-neutral-900">Log in</h1>
          <p className="text-sm text-neutral-500 mt-1">Sign in to your CareOps workspace</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-1">I am</span>
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value); setStep("IDENTIFY"); }}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="OWNER">Workspace owner</option>
                <option value="STAFF">Staff member</option>
              </select>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-1">Workspace ID</span>
              <input
                type="text"
                placeholder="e.g. 699061cbde4febef8f061af5"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1.5 text-xs text-neutral-500">
                Your workspace identifier. Owners get this when creating a workspace; staff receive it in their invite email.
              </p>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-1">Email</span>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            {role === "OWNER" && (
              <label className="block">
                <span className="block text-sm font-medium text-neutral-700 mb-1">Password</span>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
            )}

            {role === "STAFF" && step !== "IDENTIFY" && (
              <label className="block">
                <span className="block text-sm font-medium text-neutral-700 mb-1">Password</span>
                <input
                  type="password"
                  placeholder={step === "SET_PASSWORD" ? "Choose a password" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {step === "SET_PASSWORD" && (
                  <p className="mt-1.5 text-xs text-neutral-500">First time? Set a password to activate your account.</p>
                )}
              </label>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {role === "OWNER" && (
              <button
                type="button"
                onClick={login}
                disabled={!canLoginOwner}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Log in
              </button>
            )}

            {role === "STAFF" && step === "IDENTIFY" && (
              <button
                type="button"
                onClick={checkStaff}
                disabled={!canProceed}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue
              </button>
            )}

            {role === "STAFF" && step !== "IDENTIFY" && (
              <button
                type="button"
                onClick={step === "LOGIN" ? login : setStaffPassword}
                disabled={!password?.trim()}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {step === "LOGIN" ? "Log in" : "Set password & continue"}
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don’t have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">Sign up</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
