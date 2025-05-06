import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './ChatWindow.css';

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState("llama");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (loading) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", text: input }]);
    let botText = "";
    try {
      const res = await axios.post(
        "http://localhost:8000/ask/",
        new URLSearchParams({ question: input, model }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      console.log("[ChatWindow] ask response", res);
      botText = res.data.answer || "No answer found.";
    } catch (error) {
      console.error("[ChatWindow] Error during sendMessage:", error);
      if (error.response && error.response.data && error.response.data.answer) {
        botText = error.response.data.answer;
      } else {
        botText = "Error contacting server.";
      }
    }
    setMessages(prev => [...prev, { role: "bot", text: botText }]);
    setInput("");
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="model-select">
        <label>Model:</label>
        <select value={model} onChange={e => setModel(e.target.value)}>
          <option value="llama">Text (LLaMA)</option>
          <option value="distilbert">Text (DistilBERT)</option>
          <option value="visual">Visual QA</option>
        </select>
      </div>
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role} bounce`}
            style={{
              display: 'inline-block',
              minWidth: 40,
              maxWidth: '90%',
              width: 'fit-content',
              wordBreak: 'break-word',
              marginLeft: msg.role === 'user' ? 'auto' : undefined,
              marginRight: msg.role === 'bot' ? 'auto' : undefined
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage} disabled={loading}>Send</button>
        {loading && <div className="spinner"></div>}
      </div>
    </div>
  );
}
