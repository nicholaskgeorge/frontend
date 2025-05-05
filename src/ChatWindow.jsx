import React from "react";
import { useState } from "react";
import axios from "axios";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  // Selected model type
  const [model, setModel] = useState("distilbert");

  const sendMessage = async () => {
    if (!input.trim()) return;
    // Add user message
    setMessages(prev => [...prev, { role: "user", text: input }]);
    let botText = "";
    try {
      // Query backend with form encoding
      const res = await axios.post(
        "http://localhost:8000/ask/",
        new URLSearchParams({ question: input, model }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      console.log("[ChatWindow] ask response", res);
      botText = res.data.answer || "No answer found.";
    } catch (error) {
      console.error("[ChatWindow] Error during sendMessage:", error);
      // If server returned an answer in error response, use it
      if (error.response && error.response.data && error.response.data.answer) {
        botText = error.response.data.answer;
      } else {
        botText = "Error contacting server.";
      }
    }
    // Add bot response or error
    setMessages(prev => [...prev, { role: "bot", text: botText }]);
    setInput("");
  };

  return (
    <div>
      {/* Model selection dropdown */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 10 }}>Model:</label>
        <select value={model} onChange={e => setModel(e.target.value)}>
          <option value="distilbert">Text (DistilBERT)</option>
          <option value="llama">Text (LLaMA)</option>
          <option value="visual">Visual QA</option>
        </select>
      </div>
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
