import React, { useState } from "react";
import axios from "axios";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    const res = await axios.post("http://localhost:8000/ask/", new URLSearchParams({ question: input }));
    setMessages(msgs => [...msgs, { role: "bot", text: res.data.answer }]);
    setInput("");
  };

  return (
    <div>
      <div style={{ minHeight: 300, border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ color: msg.role === "user" ? "blue" : "green" }}>{msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: "80%" }}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
