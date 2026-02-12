"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        try {
            const res = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ REQUIRED
                body: JSON.stringify({ email, password }),
            });


            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // ✅ Backend sets cookie, frontend only handles role
            if (data.role === "OWNER") {
                router.push("/app/dashboard");
            } else {
                router.push("/app/inbox");
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
            />

            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}
