"use client";

import { useEffect, useState } from "react";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => {
        if (res.status === 304) throw new Error("Cached response, retry");
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data?.message || "API error");
          return data;
        });
      })
      .then(setConversations)
      .catch(() => {});
  }, []);

  const openConversation = async (conv) => {
    setSelectedConv(conv);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/conversation/${conv.conversationId}`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "API error");
    setMessages(data);
  };

  const sendReply = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/conversation/${selectedConv.conversationId}/reply`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply }),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const _d = await res.json();
    if (!res.ok) throw new Error(_d?.message || "API error");

    setReply("");
    openConversation(selectedConv);
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex flex-col">
      <div className="mb-4">
        <h1 className="page-heading">Inbox</h1>
        <p className="meta mt-1">Customer conversations in one place</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <aside className="card overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
            <h3 className="section-title">Conversations</h3>
            <span className="text-sm text-neutral-500">{conversations.length} threads</span>
          </div>

          <div className="flex-1 overflow-auto space-y-1">
            {conversations.map((c) => {
              const isActive = selectedConv?.conversationId === c.conversationId;
              return (
                <button
                  key={c.conversationId}
                  type="button"
                  onClick={() => openConversation(c)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 ring-2 ring-blue-500 ring-inset"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-neutral-900 truncate">{c.contact?.name || "Unknown"}</div>
                      <div className="text-sm text-neutral-500 truncate mt-0.5">{c.lastMessage?.content || "No messages"}</div>
                    </div>
                    {c.unreadCount ? (
                      <span className="pill-warning shrink-0">{c.unreadCount}</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="lg:col-span-2 card flex flex-col min-h-0 p-4">
          <div className="flex-1 overflow-auto space-y-4 p-2">
            {selectedConv ? (
              messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex flex-col max-w-[85%] ${
                    m.sender === "SYSTEM"
                      ? "mx-auto items-center"
                      : m.sender === "CUSTOMER"
                        ? "items-start"
                        : "items-end ml-auto"
                  }`}
                >
                  {m.sender === "SYSTEM" ? (
                    <div className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-sm">
                      {m.content}
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-medium text-neutral-500 mb-1">{m.sender}</div>
                      <div className="px-4 py-2.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-neutral-900">
                        {m.content}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-500 font-medium">
                Select a conversation to view messages
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            {selectedConv ? (
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="input flex-1"
                />
                <button className="btn-primary shrink-0" onClick={sendReply}>Send</button>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No conversation selected</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
