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
