"use client";

import { useEffect, useState } from "react";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // Load conversations
  useEffect(() => {
    fetch("http://localhost:4000/api/inbox", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setConversations);
  }, []);

  // Load messages
  const openConversation = async (conv) => {
    setSelectedConv(conv);

    const res = await fetch(
      `http://localhost:4000/api/inbox/conversation/${conv.conversationId}`,
      { credentials: "include" }
    );
    const data = await res.json();
    setMessages(data);
  };

  // Send reply
  const sendReply = async () => {
    if (!reply) return;

    await fetch(
      `http://localhost:4000/api/inbox/conversation/${selectedConv.conversationId}/reply`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      }
    );

    setReply("");
    openConversation(selectedConv);
  };

  return (
    <div style={{ display: "flex", height: "80vh" }}>
      {/* LEFT */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: 10 }}>
        <h3>Inbox</h3>
        {conversations.map((c) => (
          <div
            key={c.conversationId}
            onClick={() => openConversation(c)}
            style={{
              padding: 10,
              cursor: "pointer",
              background:
                selectedConv?.conversationId === c.conversationId
                  ? "#eee"
                  : "transparent",
            }}
          >
            <strong>{c.contact?.name}</strong>
            <p style={{ fontSize: 12 }}>{c.lastMessage?.content}</p>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div style={{ width: "70%", padding: 10 }}>
        {!selectedConv ? (
          <p>Select a conversation</p>
        ) : (
          <>
            <h4>Conversation</h4>

            <div
              style={{
                border: "1px solid #ddd",
                height: 300,
                overflowY: "auto",
                padding: 10,
              }}
            >
              {messages.map((m) => (
                <p key={m._id}>
                  <strong>{m.sender}:</strong> {m.content}
                </p>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type reply..."
                style={{ width: "80%" }}
              />
              <button onClick={sendReply}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
