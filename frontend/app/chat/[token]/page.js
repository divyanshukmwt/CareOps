"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

let socket;

export default function PublicChatPage() {
  const { token } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [adminOnline, setAdminOnline] = useState(false);
  const mountedRef = useRef(false);

  const loadMessages = async () => {
    if (!token) return;
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/chat/${token}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load conversation");
      const data = await res.json();
      setMessages(Array.isArray(data.messages) ? data.messages : data.messages || []);
    } catch (err) {
      setError("This chat link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    mountedRef.current = true;
    loadMessages();

    // init socket once
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL);
    }

    socket.emit("joinConversation", token);

    socket.on("newMessage", (msg) => {
      if (!mountedRef.current) return;
      // Only update if message belongs to this conversation
      if (msg.conversationId && (msg.conversationId === token || msg.conversationId._id === token)) {
        setMessages((m) => [...m, msg]);
      }
    });

    socket.on("customer:online", (info) => {
      if (info.conversationId === token) setAdminOnline(true);
    });

    // clear on unmount
    return () => {
      mountedRef.current = false;
      socket.off("newMessage");
      socket.off("customer:online");
    };
  }, [token]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !token) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/chat/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setInput("");
      // optimistic UI: append message locally
      const localMsg = { _id: `local_${Date.now()}`, sender: "CUSTOMER", content: text, conversationId: token };
      setMessages((m) => [...m, localMsg]);
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 700 }}>Support chat</div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: adminOnline ? "#059669" : "#6b7280" }}>
          {adminOnline ? "Admin online" : "Admin offline"}
        </div>
      </header>

      <main style={{ flex: 1, padding: 12, overflowY: "auto" }}>
        {loading ? (
          <div>Loading conversation…</div>
        ) : error ? (
          <div style={{ color: "#b91c1c" }}>{error}</div>
        ) : (
          messages.map((m) => (
            <div key={m._id || Math.random()} style={{ marginBottom: 8 }}>
              <strong>{m.sender}:</strong> <span>{m.content}</span>
            </div>
          ))
        )}
      </main>

      <footer style={{ padding: 12, borderTop: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={sendMessage} disabled={sending || !input.trim()} style={{ padding: "8px 12px" }}>
            Send
          </button>
        </div>
        {error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
      </footer>
    </div>
  );
}
