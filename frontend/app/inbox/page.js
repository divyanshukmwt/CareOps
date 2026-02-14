"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const WORKSPACE_ID = "698c41f69544ffb5052a58c4";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // Fetch inbox list
  const fetchInbox = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/${WORKSPACE_ID}`, { cache: "no-store" })
      .then((res) => {
        if (res.status === 304) throw new Error("Cached response, retry");
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data?.message || "API error");
          return data;
        });
      })
      .then(setConversations)
      .catch(console.error);
  };

  // Fetch messages
  const loadMessages = (conversationId) => {
    setSelectedConversation(conversationId);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/conversation/${conversationId}`, { cache: "no-store" })
      .then((res) => {
        if (res.status === 304) throw new Error("Cached response, retry");
        return res.json().then((data) => {
          if (!res.ok) throw new Error(data?.message || "API error");
          return data;
        });
      })
      .then(setMessages)
      .catch(console.error);
  };

  // Send reply
  const sendReply = async () => {
    if (!reply || !selectedConversation) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inbox/conversation/${selectedConversation}/reply`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply }),
    });
    if (res.status === 304) throw new Error("Cached response, retry");
    const _d = await res.json();
    if (!res.ok) throw new Error(_d?.message || "API error");

    setReply("");
  };

  // Initial load + socket setup
  useEffect(() => {
    fetchInbox();

    socket.emit("joinWorkspace", WORKSPACE_ID);

    socket.on("newMessage", (data) => {
      // 🔥 Real-time update
      fetchInbox();

      if (data.conversationId === selectedConversation) {
        loadMessages(selectedConversation);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedConversation]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT: Conversations */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <h3>Inbox</h3>

        {conversations.map((conv) => (
          <div
            key={conv.conversationId}
            onClick={() => loadMessages(conv.conversationId)}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{conv.contact.name}</strong>
            <p style={{ fontSize: "12px" }}>
              {conv.lastMessage?.content}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT: Messages */}
      <div style={{ width: "70%", padding: "10px" }}>
        {!selectedConversation ? (
          <p>Select a conversation</p>
        ) : (
          <>
            <div style={{ height: "80%", overflowY: "auto" }}>
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <strong>{msg.sender}:</strong> {msg.content}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "10px" }}>
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
