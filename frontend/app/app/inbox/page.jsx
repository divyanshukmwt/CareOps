"use client";

import { useEffect, useState } from "react";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/inbox", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setConversations);
  }, []);

  const openConversation = async (conv) => {
    setSelectedConv(conv);

    const res = await fetch(
      `http://localhost:4000/api/inbox/conversation/${conv.conversationId}`,
      { credentials: "include" }
    );
    setMessages(await res.json());
  };

  const sendReply = async () => {
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
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: 10 }}>
        <h3>Inbox</h3>
        {conversations.map(c => (
          <div key={c.conversationId} onClick={() => openConversation(c)}>
            <strong>{c.contact?.name}</strong>
            <p>{c.lastMessage?.content}</p>
          </div>
        ))}
      </div>

      <div style={{ width: "70%", padding: 10 }}>
        {messages.map(m => (
          <p key={m._id}><b>{m.sender}</b>: {m.content}</p>
        ))}

        {selectedConv && (
          <>
            <input value={reply} onChange={e => setReply(e.target.value)} />
            <button onClick={sendReply}>Send</button>
          </>
        )}
      </div>
    </div>
  );
}
