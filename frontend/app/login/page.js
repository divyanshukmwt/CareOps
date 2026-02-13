  "use client";
  import { useState } from "react";
  import { useRouter } from "next/navigation";

  export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert("Login failed");

      if (!data.hasWorkspace) router.push("/onboarding/create-workspace");
      else router.push("/app/dashboard");
    };

    return (
      <div style={{ maxWidth: 400, margin: "100px auto" }}>
        <h1>Login</h1>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    );
  }
