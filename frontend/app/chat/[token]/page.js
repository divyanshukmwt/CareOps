"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicChatPage() {
  const { token } = useParams();
  const [messages, setMessages] = useState([]);
  const [contactName, setContactName] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = () => {
    if (!token) return;
    setLoading(true);
    setError("");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/chat/${token}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load conversation");
        return res.json();
      })
      .then((data) => {
        setMessages(Array.isArray(data.messages) ? data.messages : data.messages || []);
        setContactName(data.contactName || "You");
      })
      .catch(() => setError("This chat link is invalid or expired."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
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
      loadMessages();
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-neutral-600 font-medium">Loading conversation…</p>
        </div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="mt-4 font-semibold text-neutral-900">Unable to load chat</h2>
          <p className="mt-2 text-sm text-neutral-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <header className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 12c0 4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-semibold text-neutral-900 truncate">Support chat</h1>
          <p className="text-xs text-neutral-500">Reply here and we’ll get back to you</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id || m.id || Math.random()}
            className={`flex ${m.sender === "CUSTOMER" || m.direction === "inbound" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.sender === "CUSTOMER" || m.direction === "inbound"
                  ? "bg-white border border-neutral-200 text-neutral-900"
                  : "bg-blue-600 text-white"
              }`}
            >
              {m.sender === "SYSTEM" || m.kind === "system" ? (
                <p className="text-sm text-neutral-500 italic">{m.content}</p>
              ) : (
                <p className="text-sm whitespace-pre-wrap [overflow-wrap:anywhere]">{m.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border-t border-neutral-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
